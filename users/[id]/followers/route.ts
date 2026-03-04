import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;

        const query = `
            SELECT u.id, u.name, u.email, u.profile_image 
            FROM Users u
            INNER JOIN UserFollowing uf ON u.id = uf.follower_user_id
            WHERE uf.following_user_id = ?
        `;

        const [rows] = await pool.query(query, [userId]);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching followers:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
