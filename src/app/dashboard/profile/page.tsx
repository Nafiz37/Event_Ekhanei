'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeChat, setActiveChat] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({
        designation: '',
        profile_image: null as File | null,
        organization_id_card: null as File | null,
        proof_document: null as File | null
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const parsed = JSON.parse(storedUser);
        // Fetch fresh profile data
        fetchData(parsed.id || parsed.userId || parsed.insertId);
    }, [router]);

    const fetchData = async (userId: string) => {
        try {
            const res = await fetch(`/api/user/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData(prev => ({ ...prev, designation: data.designation || '' }));
            } else {
                router.push('/login');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const data = new FormData();
        data.append('user_id', user.id);
        data.append('designation', formData.designation);
        if (formData.profile_image) data.append('profile_image', formData.profile_image);
        if (formData.organization_id_card) data.append('organization_id_card', formData.organization_id_card);
        if (formData.proof_document) data.append('proof_document', formData.proof_document);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                body: data
            });

            if (res.ok) {
                alert('Profile updated successfully!');
                fetchData(user.id);
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-zinc-400 hover:text-white mb-2 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="flex justify-between items-end">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                            My Profile
                        </h1>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-white">{user.events_organized || 0}</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider">Organized</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-white">{user.events_attended || 0}</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wider">Attended</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="col-span-1">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                            <div className="w-32 h-32 mx-auto rounded-full bg-zinc-800 mb-4 overflow-hidden border-2 border-zinc-700">
                                {user.profile_image ? (
                                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-white">{user.name}</h2>
                            <p className="text-zinc-400 text-sm mb-2">{user.email}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${user.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {user.is_verified ? '✅ Verified User' : '⚠️ Not Verified'}
                            </span>

                            <div className="text-left mt-6 pt-6 border-t border-zinc-800 space-y-3">
                                <p className="text-sm text-zinc-500">Role: <span className="text-white capitalize">{user.role}</span></p>
                                <p className="text-sm text-zinc-500">Phone: <span className="text-white">{user.phone || 'N/A'}</span></p>
                                <p className="text-sm text-zinc-500">Designation: <span className="text-white">{user.designation || 'N/A'}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="col-span-2">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-6">Verification Documents</h3>
                            <p className="text-zinc-400 text-sm mb-8">To become a verified user, please upload your organization ID and necessary proof documents.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Designation / Job Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        placeholder="e.g. Event Manager"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Profile Picture</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile_image')} className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Organization ID Card</label>
                                    <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'organization_id_card')} className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Proof of Legitimacy (Certificates/Docs)</label>
                                    <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'proof_document')} className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Organized Events Section */}
                        {user.role === 'organizer' && (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mt-8">
                                <h3 className="text-xl font-bold text-white mb-6">Events You Organized</h3>
                                <MyOrganizedEventsList userId={user.id} />
                            </div>
                        )}

                        {/* Friends Section */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mt-8">
                            <FriendsManager userId={user.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MyOrganizedEventsList({ userId }: { userId: string }) {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/events?organizer_id=${userId}`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(console.error);
    }, [userId]);

    if (events.length === 0) return <p className="text-zinc-500 italic">No events organized yet.</p>;

    return (
        <div className="space-y-4">
            {events.map((e: any) => (
                <div key={e.event_id} className="bg-black border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-zinc-700 transition">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${e.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{e.status}</span>
                            <span className="text-xs text-zinc-500">{new Date(e.start_time).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-white">{e.title}</h4>
                        <p className="text-xs text-zinc-400">{e.venue_name || 'Online'}</p>
                    </div>
                    <a href={`/dashboard/event/${e.event_id}`} className="text-sm text-zinc-400 hover:text-white underline">View</a>
                </div>
            ))}
        </div>
    );
}

function FriendsManager({ userId }: { userId: string }) {
    const [friends, setFriends] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [activeChat, setActiveChat] = useState<any>(null);

    useEffect(() => {
        fetchFriends();
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const res = await fetch(`/api/friends?user_id=${userId}`);
            if (res.ok) setFriends(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(`/api/users?search=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.filter((u: any) => u.id !== userId));
            }
        } catch (e) { console.error(e); } finally { setSearching(false); }
    };

    const sendRequest = async (friendId: string) => {
        try {
            const res = await fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, friend_id: friendId })
            });
            if (res.ok) {
                alert('Request sent!');
                setSearchResults([]);
                setSearchQuery('');
                fetchFriends();
            } else { alert('Failed'); }
        } catch (e) { console.error(e); }
    };

    const updateStatus = async (friendshipId: string, status: string) => {
        try {
            await fetch('/api/friends', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendship_id: friendshipId, status })
            });
            fetchFriends();
        } catch (e) { console.error(e); }
    };

    // Chat Window
    const ChatWindow = ({ friend, onClose }: { friend: any, onClose: () => void }) => {
        const [messages, setMessages] = useState<any[]>([]);
        const [input, setInput] = useState('');
        const [sending, setSending] = useState(false);
        const messagesEndRef = useState<HTMLDivElement | null>(null);

        useEffect(() => {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }, [friend.id]);

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/messages?user_id=${userId}&friend_id=${friend.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (e) { console.error(e); }
        };

        const sendMessage = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim()) return;
            setSending(true);
            try {
                const res = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sender_id: userId, receiver_id: friend.id, content: input })
                });
                if (res.ok) {
                    setInput('');
                    fetchMessages();
                }
            } catch (e) { console.error(e); } finally { setSending(false); }
        };

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
                    <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden pt-1.5 text-center text-lg">
                                {friend.image ? <img src={friend.image} className="w-full h-full object-cover" /> : '👤'}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{friend.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-zinc-400">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl px-2">×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
                        {messages.length === 0 && (
                            <div className="text-center mt-20 opacity-50">
                                <div className="text-4xl mb-2">👋</div>
                                <p className="text-zinc-400 text-sm">Start a conversation with {friend.name}</p>
                            </div>
                        )}
                        {messages.map((msg) => {
                            const isMe = msg.sender_id == userId;
                            return (
                                <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-gradient-to-br from-pink-600 to-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'}`}>
                                        <p>{msg.content}</p>
                                        <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-pink-200/70' : 'text-zinc-500'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={sendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2 items-center">
                        <input
                            className="flex-1 bg-black border border-zinc-700 rounded-full px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 text-sm transition-colors"
                            placeholder="Type a message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            autoFocus
                        />
                        <button
                            disabled={sending || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div>
            {activeChat && <ChatWindow friend={activeChat} onClose={() => setActiveChat(null)} />}

            <h3 className="text-xl font-bold text-white mb-6">Friends & Connections 👥</h3>

            <div className="flex gap-2 mb-6">
                <input
                    className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={searching} className="bg-zinc-800 text-white px-4 rounded-lg hover:bg-zinc-700">Find</button>
            </div>

            {searchResults.length > 0 && (
                <div className="mb-8 border-b border-zinc-800 pb-6">
                    <h4 className="text-sm font-bold text-zinc-400 mb-4">Found Users</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {searchResults.map(u => (
                            <div key={u.id} className="flex items-center justify-between bg-black p-3 rounded-xl border border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden text-center pt-1 text-sm">{u.profile_image ? <img src={u.profile_image} className="w-full h-full object-cover" /> : '👤'}</div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{u.name}</p>
                                        <p className="text-xs text-zinc-500">{u.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => sendRequest(u.id)} className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded hover:bg-indigo-500 hover:text-white transition">+ Add</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {friends.some(f => f.status === 'PENDING' && f.is_incoming) && (
                    <div>
                        <h4 className="text-sm font-bold text-yellow-500 mb-3">Pending Requests</h4>
                        <div className="space-y-3">
                            {friends.filter(f => f.status === 'PENDING' && f.is_incoming).map(f => (
                                <div key={f.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-yellow-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden text-center pt-1 text-sm">{f.friend.image ? <img src={f.friend.image} className="w-full h-full object-cover" /> : '👤'}</div>
                                        <p className="font-bold text-white text-sm">{f.friend.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => updateStatus(f.id, 'ACCEPTED')} className="text-xs bg-green-500 text-white px-3 py-1 rounded">Accept</button>
                                        <button onClick={() => updateStatus(f.id, 'REJECTED')} className="text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-sm font-bold text-zinc-400 mb-3">My Friends ({friends.filter(f => f.status === 'ACCEPTED').length})</h4>
                    {friends.filter(f => f.status === 'ACCEPTED').length === 0 ? (
                        <p className="text-zinc-500 text-sm italic">You haven't added any friends yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {friends.filter(f => f.status === 'ACCEPTED').map(f => (
                                <div key={f.id} className="flex items-center justify-between bg-black p-3 rounded-xl border border-zinc-800 group hover:border-zinc-600 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden text-center pt-1.5">{f.friend.image ? <img src={f.friend.image} className="w-full h-full object-cover" /> : '👤'}</div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{f.friend.name}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                <span className="text-[10px] text-zinc-500">Friend</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveChat(f.friend)}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20 active:scale-95"
                                        title="Send Message"
                                    >
                                        💬
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
