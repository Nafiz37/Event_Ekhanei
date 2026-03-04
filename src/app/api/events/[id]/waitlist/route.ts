import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;

        const query = `
            SELECT w.*, u.name as user_name, u.email 
            FROM EventWaitlist w
            JOIN Users u ON w.user_id = u.id
            WHERE w.event_id = ?
            ORDER BY w.position_in_queue ASC
        `;

        const [rows] = await pool.query(query, [eventId]);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching waitlist:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const body = await request.json();
        const { user_id, ticket_type_id } = body;

        if (!user_id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Get current max position
        const [maxPosResult]: any = await pool.query(
            'SELECT COALESCE(MAX(position_in_queue), 0) as maxPos FROM EventWaitlist WHERE event_id = ?',
            [eventId]
        );
        const nextPosition = maxPosResult[0].maxPos + 1;

        await pool.execute(
            `INSERT INTO EventWaitlist (event_id, user_id, ticket_type_id, position_in_queue) 
             VALUES (?, ?, ?, ?)`,
            [eventId, user_id, ticket_type_id || null, nextPosition]
        );

        return NextResponse.json({
            message: 'Added to waitlist successfully',
            position: nextPosition
        }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ message: 'You are already on the waitlist for this event' }, { status: 400 });
        }
        console.error('Error joining waitlist:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
