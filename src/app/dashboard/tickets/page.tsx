'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyTickets() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        fetchTickets(parsed.id || parsed.userId || parsed.insertId);
    }, [router]);

    const fetchTickets = async (userId: string) => {
        try {
            const res = await fetch(`/api/bookings?user_id=${userId}`);
            if (res.ok) {
                setTickets(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (ticketId: string) => {
        // Create a print window or just print current logic
        // For better UX, we'd open a dedicated clean print page, but using browser print on a specific element is tricky without a lib.
        // Simple approach: Use a specific print style or open a new window with just the ticket HTML.
        const printWindow = window.open('', '', 'height=600,width=800');
        const ticketElement = document.getElementById(`ticket-${ticketId}`);

        if (printWindow && ticketElement) {
            printWindow.document.write('<html><head><title>Print Ticket</title>');
            // Add some basic styles
            printWindow.document.write(`
                <style>
                    body { font-family: sans-serif; -webkit-print-color-adjust: exact; padding: 20px; display: flex; justify-content: center; }
                    .ticket-container { border: 2px solid #000; border-radius: 12px; overflow: hidden; width: 600px; display: flex; }
                    .left { background: #000; color: #fff; padding: 24px; flex: 1; position: relative; }
                    .right { background: #fff; color: #000; padding: 24px; border-left: 2px dashed #000; width: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
                    h1 { margin: 0 0 10px; font-size: 24px; }
                    p { margin: 5px 0; }
                    .label { font-size: 10px; text-transform: uppercase; color: #888; margin-top: 10px; }
                    .value { font-size: 14px; font-weight: bold; }
                    .barcode { margin-top: 20px; text-align: center; font-family: monospace; letter-spacing: 4px; border: 1px solid #333; padding: 5px; background: #fff; color: #000;}
                </style>
            `);
            printWindow.document.write('</head><body>');
            printWindow.document.write(ticketElement.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-zinc-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                        My Tickets
                    </h1>
                </header>

                {tickets.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                        <p className="text-zinc-500">You haven't booked any tickets yet.</p>
                        <button onClick={() => router.push('/dashboard')} className="mt-4 text-pink-500 hover:text-pink-400">Browse Events</button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {tickets.map((t) => (
                            <div key={t.ticket_id} className="group">
                                {/* Visual Ticket Representation for Screen */}
                                <div className="relative flex flex-col md:flex-row bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-pink-500/50 transition-all">
                                    {/* Main Section */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-gradient-to-br from-zinc-900 to-black">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <span className="px-3 py-1 rounded bg-white/10 text-white text-xs font-bold tracking-wider mb-4 inline-block">{t.ticket_name}</span>
                                                <span className="text-zinc-500 font-mono text-xs">#{t.unique_code.slice(0, 8)}</span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.event_title}</h2>
                                            <p className="text-zinc-400 text-sm">{new Date(t.start_time).toLocaleDateString()} • {new Date(t.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mt-8">
                                            <div>
                                                <p className="text-xs text-zinc-600 uppercase font-bold">Venue</p>
                                                <p className="text-sm text-white font-medium">{t.venue_name}</p>
                                                <p className="text-xs text-zinc-500">{t.venue_city}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-600 uppercase font-bold">Admit</p>
                                                <p className="text-sm text-white font-medium">1 Person</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforation Line (Visual) */}
                                    <div className="hidden md:block w-0 border-l-2 border-dashed border-zinc-800 relative">
                                        <div className="absolute -top-3 -left-3 w-6 h-6 bg-black rounded-full"></div>
                                        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-black rounded-full"></div>
                                    </div>

                                    {/* Stub Section */}
                                    <div className="md:w-64 bg-zinc-950 p-6 flex flex-col items-center justify-center text-center border-t md:border-t-0 border-zinc-800">

                                        {t.status === 'CANCELLED' ? (
                                            <div className="w-32 h-32 bg-red-500/10 rounded mb-4 flex items-center justify-center border border-red-500/20">
                                                <span className="text-red-500 font-bold transform -rotate-12 border-2 border-red-500 px-2 py-1 rounded">CANCELLED</span>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 bg-white p-2 rounded mb-4">
                                                {/* Placeholder QR */}
                                                <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">QR CODE</div>
                                            </div>
                                        )}

                                        <p className="text-zinc-500 text-xs font-mono mb-4">{t.unique_code}</p>

                                        {t.status === 'VALID' && (
                                            <div className="w-full space-y-2">
                                                <button
                                                    onClick={() => handlePrint(t.ticket_id)}
                                                    className="w-full py-2 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors text-sm"
                                                >
                                                    Download Ticket
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const eventDate = new Date(t.start_time);
                                                        const now = new Date();
                                                        const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

                                                        let confirmMsg = '';
                                                        if (diffDays > 7) {
                                                            confirmMsg = 'You are more than 7 days away. You will receive a FULL REFUND. Proceed?';
                                                        } else if (diffDays > 2) {
                                                            confirmMsg = `You are within 7 days. You will receive a 50% REFUND (৳${(Number(t.price) * 0.5).toFixed(2)}). Proceed?`;
                                                        } else {
                                                            alert('Cannot cancel within 48 hours of the event.');
                                                            return;
                                                        }

                                                        if (confirm(confirmMsg)) {
                                                            try {
                                                                const res = await fetch('/api/bookings/cancel', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ ticket_id: t.ticket_id, user_id: user.id })
                                                                });
                                                                const data = await res.json();
                                                                if (res.ok) {
                                                                    alert(data.message);
                                                                    fetchTickets(user.id);
                                                                } else {
                                                                    alert(data.message);
                                                                }
                                                            } catch (e) {
                                                                console.error(e);
                                                            }
                                                        }
                                                    }}
                                                    className="w-full py-2 bg-transparent border border-zinc-700 text-zinc-400 font-bold rounded hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-colors text-sm"
                                                >
                                                    Cancel Ticket
                                                </button>
                                            </div>
                                        )}
                                        {t.status === 'CANCELLED' && (
                                            <p className="text-red-500 text-xs mt-2">Refunded: ৳{t.refund_amount ? Number(t.refund_amount).toFixed(2) : '0.00'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Hidden Printable Version */}
                                <div id={`ticket-${t.ticket_id}`} className="hidden">
                                    <div className="ticket-container">
                                        <div className="left">
                                            <h1>{t.event_title}</h1>
                                            <p className="value">{new Date(t.start_time).toLocaleDateString()} @ {new Date(t.start_time).toLocaleTimeString()}</p>
                                            <p className="label">LOCATION</p>
                                            <p className="value">{t.venue_name}, {t.venue_city}</p>
                                            <p className="label">TICKET TYPE</p>
                                            <p className="value">{t.ticket_name}</p>
                                            <div className="barcode">{t.unique_code}</div>
                                        </div>
                                        <div className="right">
                                            <p className="label">ADMIT ONE</p>
                                            <div style={{ width: '80px', height: '80px', background: '#000', margin: '10px' }}></div>
                                            <p className="value">৳{Number(t.price).toFixed(2)}</p>
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
