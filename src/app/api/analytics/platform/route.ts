import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Aggregated platform metrics
        const [userCount]: any = await pool.query('SELECT COUNT(*) as count FROM Users');
        const [eventCount]: any = await pool.query('SELECT COUNT(*) as count FROM Events WHERE status = "PUBLISHED"');
        const [bookingCount]: any = await pool.query('SELECT COUNT(*) as count FROM Bookings WHERE status = "VALID"');
        const [revenue]: any = await pool.query('SELECT SUM(amount) as total FROM Payments WHERE payment_status = "Completed"');

        return NextResponse.json({
            total_users: userCount[0].count,
            active_events: eventCount[0].count,
            total_bookings: bookingCount[0].count,
            total_revenue: revenue[0].total || 0,
            currency: 'BDT'
        });
    } catch (error) {
        console.error('Error fetching platform analytics:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
