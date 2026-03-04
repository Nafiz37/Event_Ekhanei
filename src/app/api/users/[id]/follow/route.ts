import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: following_user_id } = await params;
        const body = await request.json();
        const { follower_user_id } = body;

        if (!follower_user_id) {
            return NextResponse.json({ message: 'follower_user_id is required' }, { status: 400 });
        }

        if (follower_user_id == following_user_id) {
            return NextResponse.json({ message: 'You cannot follow yourself' }, { status: 400 });
        }

        await pool.execute(
            'INSERT INTO UserFollowing (follower_user_id, following_user_id) VALUES (?, ?)',
            [follower_user_id, following_user_id]
        );

        return NextResponse.json({ message: 'Following user successfully' }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ message: 'You are already following this user' }, { status: 400 });
        }
        console.error('Error following user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: following_user_id } = await params;
        const { searchParams } = new URL(request.url);
        const follower_user_id = searchParams.get('follower_id');

        if (!follower_user_id) {
            return NextResponse.json({ message: 'follower_id is required' }, { status: 400 });
        }

        await pool.execute(
            'DELETE FROM UserFollowing WHERE follower_user_id = ? AND following_user_id = ?',
            [follower_user_id, following_user_id]
        );

        return NextResponse.json({ message: 'Unfollowed user successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
