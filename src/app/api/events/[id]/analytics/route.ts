import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;

        const query = `
            SELECT * FROM EventAnalytics 
            WHERE event_id = ?
            ORDER BY captured_date DESC
        `;

        const [rows] = await pool.query(query, [eventId]);

        // Parse JSON fields
        const processedRows = (rows as any[]).map(row => ({
            ...row,
            source_breakdown: row.source_breakdown ? JSON.parse(row.source_breakdown) : null,
            device_breakdown: row.device_breakdown ? JSON.parse(row.device_breakdown) : null,
            geographic_breakdown: row.geographic_breakdown ? JSON.parse(row.geographic_breakdown) : null
        }));

        return NextResponse.json(processedRows);
    } catch (error) {
        console.error('Error fetching event analytics:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
