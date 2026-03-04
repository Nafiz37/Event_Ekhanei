import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;

        const query = `
            SELECT * FROM EventRevenue 
            WHERE event_id = ?
            ORDER BY report_date DESC
        `;

        const [rows] = await pool.query(query, [eventId]);

        const processedRows = (rows as any[]).map(row => ({
            ...row,
            breakdown: row.breakdown ? JSON.parse(row.breakdown) : null
        }));

        return NextResponse.json(processedRows);
    } catch (error) {
        console.error('Error fetching event revenue:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
