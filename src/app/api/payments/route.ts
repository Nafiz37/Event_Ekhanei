import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { booking_id, user_id, amount, payment_method, payment_gateway, metadata } = body;

        if (!booking_id || !user_id || !amount || !payment_method) {
            return NextResponse.json({ message: 'Missing required payment fields' }, { status: 400 });
        }

        const transaction_id = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;

        const query = `
            INSERT INTO Payments (
                booking_id, user_id, amount, payment_method, 
                payment_status, transaction_id, payment_gateway, metadata
            ) VALUES (?, ?, ?, ?, 'Completed', ?, ?, ?)
        `;

        const [result]: any = await pool.execute(query, [
            booking_id, user_id, amount, payment_method,
            transaction_id, payment_gateway || 'Internal',
            metadata ? JSON.stringify(metadata) : null
        ]);

        // Update booking status
        await pool.execute(
            "UPDATE Bookings SET payment_status = 'COMPLETED' WHERE booking_id = ?",
            [booking_id]
        );

        // Track platform fees
        // Assume 3.5% + 0.50 fee
        const percentage_fee = 3.50;
        const fixed_fee = 0.50;
        const total_fees = (amount * (percentage_fee / 100)) + fixed_fee;

        // Get event_id from booking
        const [bookingRows]: any = await pool.query('SELECT event_id FROM Bookings WHERE booking_id = ?', [booking_id]);
        const event_id = bookingRows[0]?.event_id;

        if (event_id) {
            await pool.execute(
                'INSERT INTO PlatformFees (event_id, percentage_fee, fixed_fee, total_fees, payment_id) VALUES (?, ?, ?, ?, ?)',
                [event_id, percentage_fee, fixed_fee, total_fees, result.insertId]
            );
        }

        return NextResponse.json({
            message: 'Payment processed successfully',
            payment_id: result.insertId,
            transaction_id
        }, { status: 201 });
    } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
