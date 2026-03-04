'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [dailyData, setDailyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/analytics/platform').then(res => res.json()),
            fetch('/api/analytics/daily?days=10').then(res => res.json())
        ])
            .then(([platformData, daily]) => {
                setMetrics(platformData);
                // Reverse to show chronological order for the chart
                setDailyData(daily.reverse());
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-64 animate-pulse bg-white/5 rounded-3xl" />;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`${Number(metrics.total_revenue).toLocaleString()} ${metrics.currency}`}
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

            {/* Engagement Chart Section */}
            <div className="bg-[#161B2B] border border-white/5 rounded-3xl p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-cyan-400" size={20} />
                            Platform Engagement
                        </h3>
                        <p className="text-gray-500 text-sm">Real-time daily booking activity tracking</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <span className="text-xs text-gray-400">Daily Bookings</span>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full relative group">
                    <EngagementChart data={dailyData} />
                </div>
            </div>
        </div>
    );
}

function EngagementChart({ data }: { data: any[] }) {
    if (!data.length) return null;

    const maxBookings = Math.max(...data.map(d => d.total_bookings), 1);
    const width = 800;
    const height = 200;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d.total_bookings / (maxBookings * 1.2)) * height;
        return `${x},${y}`;
    }).join(' ');

    const linePath = `M ${points}`;
    const areaPath = `M 0,${height} L ${points} L ${width},${height} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <line
                    key={p}
                    x1="0" y1={height * p} x2={width} y2={height * p}
                    stroke="white" strokeOpacity="0.05" strokeWidth="1"
                    strokeDasharray="4 4"
                />
            ))}

            {/* Area Path */}
            <motion.path
                d={areaPath}
                initial={{ opacity: 0, d: `M 0,${height} L ${data.map((_, i) => `${(i / (data.length - 1)) * width},${height}`).join(' ')} L ${width},${height} Z` }}
                animate={{ opacity: 1, d: areaPath }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                fill="url(#areaGradient)"
            />

            {/* Line Path */}
            <motion.path
                d={linePath}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />

            {/* Data Points */}
            {data.map((d, i) => {
                const x = (i / (data.length - 1)) * width;
                const y = height - (d.total_bookings / (maxBookings * 1.2)) * height;
                return (
                    <motion.g key={i}>
                        <motion.circle
                            initial={{ r: 0 }}
                            animate={{ r: 4 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            cx={x} cy={y}
                            fill="#06b6d4"
                            stroke="#0B0F1A"
                            strokeWidth="2"
                            className="drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]"
                        />
                        <text
                            x={x} y={height + 20}
                            className="text-[10px] fill-gray-500 font-medium select-none"
                            textAnchor="middle"
                        >
                            {new Date(d.metric_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </text>
                    </motion.g>
                );
            })}
        </svg>
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
