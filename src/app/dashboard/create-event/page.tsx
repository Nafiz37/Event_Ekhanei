'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEvent() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [venues, setVenues] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        venue_id: '',
        category_id: '',
        status: 'PUBLISHED' // Default to published for now
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));

        // Fetch options
        fetchVenuesAndCategories();
    }, [router]);

    const fetchVenuesAndCategories = async () => {
        try {
            const [vRes, cRes] = await Promise.all([
                fetch('/api/venues'),
                fetch('/api/categories')
            ]);

            if (vRes.ok) setVenues(await vRes.json());
            if (cRes.ok) setCategories(await cRes.json());
        } catch (error) {
            console.error('Failed to fetch options', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    organizer_id: user.id || user.userId || (user as any).insertId,
                    listing_fee: 1000.00,
                    payment_confirmed: true // In production this would come from stripe/payment provider
                })
            });

            if (!res.ok) throw new Error('Failed to create event');

            router.push('/dashboard');
        } catch (error) {
            alert('Error creating event');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-zinc-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                        Create New Event
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Event Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                        <textarea
                            className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors h-32"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Start Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors dark-calendar"
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">End Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors dark-calendar"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Venue</label>
                            <select
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                                value={formData.venue_id}
                                onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                            >
                                <option value="">Select a Venue (Optional)</option>
                                {venues.map((v: any) => (
                                    <option key={v.venue_id} value={v.venue_id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                            <select
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="">Select a Category (Optional)</option>
                                {categories.map((c: any) => (
                                    <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Payment Section for Organizer */}
                    <div className="border-t border-zinc-800 pt-8 mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Listing Fee Payment</h3>
                                <p className="text-sm text-zinc-500">Pay the platform fee to publish your event</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-white">৳1,000.00</span>
                                <span className="block text-xs text-zinc-500">One-time fee</span>
                            </div>
                        </div>

                        <div className="bg-black border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2 10h20v2H2zm0-2V6c0-1.103.897-2 2-2h16c1.103 0 2 .897 2 2v2H2zm0 12v-8h20v8c0 1.103-.897 2-2 2H4c-1.103 0-2-.897-2-2z" /></svg>
                            </div>

                            <div className="grid grid-cols-1 gap-4 relative z-10">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 font-mono tracking-widest placeholder-zinc-700" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Expiry</label>
                                        <input type="text" placeholder="MM/YY" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 font-mono text-center placeholder-zinc-700" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">CVC</label>
                                        <input type="text" placeholder="123" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 font-mono text-center placeholder-zinc-700" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Cardholder Name</label>
                                    <input type="text" placeholder="JOHN DOE" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 uppercase placeholder-zinc-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx global>{`
                .dark-calendar::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
