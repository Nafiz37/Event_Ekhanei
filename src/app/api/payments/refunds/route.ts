import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        let query = 'SELECT r.*, p.amount as original_amount, p.currency FROM Refunds r JOIN Payments p ON r.payment_id = p.payment_id';
        const params = [];

        if (userId) {
            query += ' WHERE r.requested_by = ?';
            params.push(userId);
        }

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching refunds:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { payment_id, booking_id, amount, reason, requested_by } = body;

        if (!payment_id || !booking_id || !amount || !requested_by) {
            return NextResponse.json({ message: 'Missing required refund fields' }, { status: 400 });
        }

        await pool.execute(
            `INSERT INTO Refunds (payment_id, booking_id, amount, reason, requested_by) 
             VALUES (?, ?, ?, ?, ?)`,
            [payment_id, booking_id, amount, reason || null, requested_by]
        );

        return NextResponse.json({ message: 'Refund request submitted successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error submitting refund:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
