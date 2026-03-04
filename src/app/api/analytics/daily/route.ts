import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const [rows] = await pool.query(
            'SELECT * FROM DailyMetrics ORDER BY metric_date DESC LIMIT ?',
            [days]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching daily metrics:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
