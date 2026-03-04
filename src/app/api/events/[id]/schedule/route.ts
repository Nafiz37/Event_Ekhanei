import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;

        const query = `
            SELECT * FROM EventSchedule 
            WHERE event_id = ?
            ORDER BY start_time ASC
        `;

        const [rows] = await pool.query(query, [eventId]);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching schedule:', error);
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
        const { session_name, description, start_time, end_time, location, speaker_or_host_name, capacity } = body;

        if (!session_name || !start_time || !end_time) {
            return NextResponse.json({ message: 'Session name and times are required' }, { status: 400 });
        }

        await pool.execute(
            `INSERT INTO EventSchedule (
                event_id, session_name, description, start_time, end_time, 
                location, speaker_or_host_name, capacity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [eventId, session_name, description || null, start_time, end_time, location || null, speaker_or_host_name || null, capacity || null]
        );

        return NextResponse.json({ message: 'Schedule session added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding schedule session:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
