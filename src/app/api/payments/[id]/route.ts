import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paymentId } = await params;

        const [rows]: any = await pool.query(
            'SELECT p.*, u.name as user_name, b.event_id FROM Payments p JOIN Users u ON p.user_id = u.id JOIN Bookings b ON p.booking_id = b.booking_id WHERE p.payment_id = ?',
            [paymentId]
        );

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
        }

        const payment = rows[0];
        if (payment.metadata) payment.metadata = JSON.parse(payment.metadata);

        return NextResponse.json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
