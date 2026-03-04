'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, UserX, UserCheck, Search } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="h-64 animate-pulse bg-white/5 rounded-3xl" />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold">User Database</h3>
                    <p className="text-gray-400 text-sm">Manage {users.length} registered members</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-[#0B0F1A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user, i) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                <Users size={20} className="text-cyan-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{user.name}</h4>
                                <p className="text-xs text-gray-500">{user.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded capitalize font-bold ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                                            user.role === 'organizer' ? 'bg-purple-500/10 text-purple-400' :
                                                'bg-gray-800 text-gray-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                    {user.is_suspended && <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 font-bold uppercase">Suspended</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400" title="Revoke Role"><Shield size={16} /></button>
                            <button className="p-2 rounded-lg hover:bg-orange-500/10 text-orange-500" title="Suspend"><UserX size={16} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
