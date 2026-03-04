'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics/platform')
            .then(res => res.json())
            .then(data => setMetrics(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-64 animate-pulse bg-white/5 rounded-3xl" />;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`${metrics.total_revenue} ${metrics.currency}`}
                    icon={<DollarSign size={20} />}
                    trend="+12% from last month"
                />
                <MetricCard
                    title="Total Users"
                    value={metrics.total_users}
                    icon={<Users size={20} />}
                    trend="+5% from last week"
                />
                <MetricCard
                    title="Active Events"
                    value={metrics.active_events}
                    icon={<Calendar size={20} />}
                    trend="+3 new today"
                />
                <MetricCard
                    title="Total Bookings"
                    value={metrics.total_bookings}
                    icon={<Activity size={20} />}
                    trend="+8% conversion"
                />
            </div>

            {/* Placeholder for charts */}
            <div className="bg-[#0B0F1A]/80 border border-white/5 rounded-3xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                    <TrendingUp size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Real-time engagement charts will appear here.</p>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-cyan-500/30 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    {icon}
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h4 className="text-2xl font-black text-white">{value}</h4>
        </motion.div>
    );
}
