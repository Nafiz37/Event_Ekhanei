'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export default function ModerationQueue() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = () => {
        setLoading(true);
        fetch('/api/admin/reports?status=New')
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (id: number, status: string, action: string = 'None') => {
        const admin = JSON.parse(localStorage.getItem('user') || '{}');
        try {
            const res = await fetch(`/api/admin/reports/${id}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    action_taken: action === 'None' ? null : action,
                    admin_id: admin.id
                })
            });
            if (res.ok) {
                fetchReports();
            }
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="h-64 animate-pulse bg-white/5 rounded-3xl" />;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Content Moderation Queue</h3>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">{reports.length} New Reports</span>
            </div>

            <div className="space-y-3">
                {reports.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <CheckCircle size={48} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500">The queue is empty. Content looks clean!</p>
                    </div>
                ) : (
                    reports.map((report, i) => (
                        <ReportItem
                            key={report.report_id}
                            report={report}
                            index={i}
                            onResolve={handleResolve}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function ReportItem({ report, index, onResolve }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{report.content_type} #{report.content_id}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="text-xs text-red-400 font-medium">{report.reason}</span>
                    </div>
                    <p className="text-sm text-white font-medium line-clamp-1">{report.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onResolve(report.report_id, 'Dismissed')}
                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all"
                    title="Dismiss / Safe"
                >
                    <CheckCircle size={18} />
                </button>
                <button
                    onClick={() => onResolve(report.report_id, 'Action Taken', 'Content Removed')}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Remove Content"
                >
                    <XCircle size={18} />
                </button>
            </div>
        </motion.div>
    );
}
