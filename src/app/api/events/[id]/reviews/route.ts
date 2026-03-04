import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;

        const query = `
            SELECT r.*, u.name as user_name, u.profile_image 
            FROM EventReviews r
            JOIN Users u ON r.user_id = u.id
            WHERE r.event_id = ?
            ORDER BY r.review_date DESC
        `;

        const [rows] = await pool.query(query, [eventId]);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
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
        const { user_id, rating, title, content } = body;

        if (!user_id || !rating) {
            return NextResponse.json({ message: 'User ID and rating are required' }, { status: 400 });
        }

        await pool.execute(
            `INSERT INTO EventReviews (event_id, user_id, rating, title, content) 
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                rating = VALUES(rating),
                title = VALUES(title),
                content = VALUES(content)`,
            [eventId, user_id, rating, title || null, content || null]
        );

        return NextResponse.json({ message: 'Review submitted successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
