'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ users: 0, events: 0, pendingRequests: 0 });
    const [requests, setRequests] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('requests');

    useEffect(() => {
        const checkAdmin = () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                router.push('/login');
                return;
            }
            const user = JSON.parse(storedUser);
            if (user.role !== 'admin') {
                router.push('/dashboard');
                return;
            }
            fetchData();
        };
        checkAdmin();
    }, [router]);

    const fetchData = async () => {
        try {
            const [reqRes, usersRes, eventsRes] = await Promise.all([
                fetch('/api/admin/requests'),
                fetch('/api/users'),
                fetch('/api/events')
            ]);

            if (reqRes.ok) {
                const reqData = await reqRes.json();
                setRequests(reqData);
                setStats(s => ({ ...s, pendingRequests: reqData.length }));
            }
            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setUsers(usersData);
                setStats(s => ({ ...s, users: usersData.length }));
            }
            if (eventsRes.ok) {
                const eventsData = await eventsRes.json();
                setEvents(eventsData);
                setStats(s => ({ ...s, events: eventsData.length }));
            }
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
    };

    const handleRequestAction = async (requestId: number, status: 'APPROVED' | 'REJECTED') => {
        try {
            const res = await fetch('/api/admin/requests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: requestId, status })
            });
            if (res.ok) {
                // Refresh data
                fetchData();
            } else {
                alert('Action failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Admin Internal
                    </h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-zinc-400 hover:text-white"
                    >
                        Exit to Dashboard
                    </button>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Pending Requests</h3>
                        <p className="text-3xl font-bold text-orange-500">{stats.pendingRequests}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-white">{stats.users}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Events</h3>
                        <p className="text-3xl font-bold text-white">{stats.events}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-1">
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'requests' ? 'text-white border-b-2 border-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Role Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'users' ? 'text-white border-b-2 border-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'events' ? 'text-white border-b-2 border-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        All Events
                    </button>
                </div>

                {/* Content */}
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                    {activeTab === 'requests' && (
                        <div>
                            {requests.length === 0 ? (
                                <p className="text-zinc-500 italic">No pending requests.</p>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-zinc-500 text-sm border-b border-zinc-800">
                                            <th className="pb-4">User</th>
                                            <th className="pb-4">Email</th>
                                            <th className="pb-4">Requested Role</th>
                                            <th className="pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {requests.map((req: any) => (
                                            <tr key={req.request_id} className="group">
                                                <td className="py-4 font-medium">{req.name}</td>
                                                <td className="py-4 text-zinc-400">{req.email}</td>
                                                <td className="py-4 text-orange-400 capitalize">{req.requested_role}</td>
                                                <td className="py-4 text-right gap-2 flex justify-end">
                                                    <button
                                                        onClick={() => handleRequestAction(req.request_id, 'APPROVED')}
                                                        className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 text-sm font-medium transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req.request_id, 'REJECTED')}
                                                        className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-zinc-500 text-sm border-b border-zinc-800">
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Role</th>
                                    <th className="pb-4">Verification</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {users.map((u: any) => (
                                    <tr key={u.id}>
                                        <td className="py-4">
                                            <div>
                                                <div className="font-medium text-white">{u.name}</div>
                                                <div className="text-sm text-zinc-500">{u.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : u.role === 'organizer' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${u.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                                {u.is_verified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {!u.is_verified && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm(`Verify user ${u.name}?`)) {
                                                            await fetch('/api/admin/verify-user', {
                                                                method: 'PUT',
                                                                body: JSON.stringify({ user_id: u.id, is_verified: true })
                                                            });
                                                            fetchData();
                                                        }
                                                    }}
                                                    className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/20"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                            {u.is_verified && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm(`Revoke verification for ${u.name}?`)) {
                                                            await fetch('/api/admin/verify-user', {
                                                                method: 'PUT',
                                                                body: JSON.stringify({ user_id: u.id, is_verified: false })
                                                            });
                                                            fetchData();
                                                        }
                                                    }}
                                                    className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded hover:bg-red-500/20 ml-2"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'events' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-zinc-500 text-sm border-b border-zinc-800">
                                    <th className="pb-4">Title</th>
                                    <th className="pb-4">Organizer</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {events.map((e: any) => (
                                    <tr key={e.event_id}>
                                        <td className="py-4 font-medium">{e.title}</td>
                                        <td className="py-4 text-zinc-400">{e.organizer_name}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${e.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-zinc-500 text-sm">{new Date(e.start_time).toLocaleDateString()}</td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to delete this event?')) {
                                                        await fetch(`/api/events/${e.event_id}`, { method: 'DELETE' });
                                                        fetchData();
                                                    }
                                                }}
                                                className="text-xs bg-red-500/10 text-red-500 px-3 py-1 rounded hover:bg-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
