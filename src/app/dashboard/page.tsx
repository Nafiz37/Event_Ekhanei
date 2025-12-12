'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'pending' | 'success'>('idle');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Check for user in local storage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    // Initial fetch
    useEffect(() => {
        if (user) fetchEvents();
    }, [user]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) fetchEvents();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`/api/events?search=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                const upcomingEvents = data.filter((e: any) => new Date(e.end_time) > new Date());
                setEvents(upcomingEvents);
            }
        } catch (error) {
            console.error('Failed to fetch events', error);
        }
    };

    const handleRequestRole = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/user/request-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id || user.userId || (user as any).insertId })
            });
            if (res.ok) {
                alert('Request submitted! Admin will review it.');
                setRequestStatus('success');
            } else {
                const data = await res.json();
                alert(data.message || 'Request failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                            Event Koi Dashboard
                        </h1>
                        <p className="text-zinc-400 mt-2">Welcome back, {user.name} <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 uppercase ml-2">{user.role}</span></p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-right">
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-white">{user.name}</p>
                                <p className="text-xs text-zinc-500 uppercase">
                                    {user.role === 'organizer' ? 'Attendee / Organizer' : user.role}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl overflow-hidden border border-zinc-700">
                                {user.profile_image ? (
                                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>👤</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/dashboard/profile')}
                                className="text-zinc-400 hover:text-white text-sm whitespace-nowrap"
                            >
                                👤 My Profile
                            </button>

                            {(user.role === 'attendee' || user.role === 'organizer') && (
                                <button
                                    onClick={() => router.push('/dashboard/tickets')}
                                    className="text-zinc-400 hover:text-white text-sm whitespace-nowrap"
                                >
                                    🎟️ My Tickets
                                </button>
                            )}

                            {/* Notifications */}
                            <NotificationBell userId={user.id || user.userId || (user as any).insertId} />
                        </div>

                        <div className="h-6 w-px bg-zinc-800"></div>

                        {user.role === 'admin' && (
                            <button
                                onClick={() => router.push('/dashboard/admin')}
                                className="px-6 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-medium transition-colors"
                            >
                                🛡️ Admin Panel
                            </button>
                        )}

                        {user.role === 'organizer' && (
                            <button
                                onClick={() => router.push('/dashboard/create-event')}
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                + Create Event
                            </button>
                        )}

                        {user.role === 'attendee' && (
                            <button
                                onClick={handleRequestRole}
                                disabled={requestStatus === 'success'}
                                className="px-6 py-2 rounded-lg bg-zinc-800 border-zinc-700 border hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
                            >
                                {requestStatus === 'success' ? 'Request Pending...' : '✨ Become an Organizer'}
                            </button>
                        )}

                        <button
                            onClick={() => {
                                localStorage.removeItem('user');
                                router.push('/login');
                            }}
                            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition-colors text-zinc-300"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Your Role</h3>
                        <p className="text-3xl font-bold text-white capitalize">{user.role}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Member Since</h3>
                        <p className="text-xl text-white">
                            {new Date(user.created_at || Date.now()).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Events</h3>
                        <p className="text-3xl font-bold text-white">{events.length}</p>
                    </div>
                </div>

                {/* Events Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by event or organizer..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-3 top-2.5 text-zinc-500">🔍</span>
                    </div>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                        <p className="text-zinc-500">No events found. Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event: any) => (
                            <div
                                key={event.event_id}
                                onClick={() => router.push(`/dashboard/event/${event.event_id}`)}
                                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {event.status}
                                        </span>
                                        <span className="text-zinc-500 text-xs">
                                            {event.category_name || 'Uncategorized'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 text-sm text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>{new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📍</span>
                                            <span>{event.venue_name || 'TBA'} {event.venue_city ? `(${event.venue_city})` : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>👤</span>
                                            <span>By {event.organizer_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/notifications?user_id=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.is_read).length);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notification_id: id })
            });
            // Update local state
            setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-center text-zinc-500 text-sm">No notifications</p>
                            ) : (
                                <div>
                                    {notifications.map(n => (
                                        <div
                                            key={n.notification_id}
                                            className={`p-4 border-b border-zinc-800/50 hover:bg-white/5 transition-colors cursor-pointer ${!n.is_read ? 'bg-indigo-500/5' : ''}`}
                                            onClick={() => !n.is_read && markAsRead(n.notification_id)}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1 text-lg">
                                                    {n.type === 'MESSAGE' && '💬'}
                                                    {n.type === 'EVENT_REMINDER' && '⏰'}
                                                    {n.type === 'NEW_EVENT' && '🎉'}
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${!n.is_read ? 'text-white font-medium' : 'text-zinc-400'}`}>{n.content}</p>
                                                    <p className="text-[10px] text-zinc-600 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                                                </div>
                                                {!n.is_read && <div className="ml-auto w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-2"></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
