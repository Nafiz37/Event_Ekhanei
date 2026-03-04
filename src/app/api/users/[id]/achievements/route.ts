import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;

        const [rows] = await pool.query(
            'SELECT * FROM UserAchievements WHERE user_id = ? ORDER BY earned_date DESC',
            [userId]
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
