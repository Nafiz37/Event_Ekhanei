import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const body = await request.json();
        const { admin_id } = body;

        await pool.execute(
            'UPDATE Users SET is_verified = TRUE WHERE id = ?',
            [userId]
        );

        await pool.execute(
            'UPDATE UserProfiles SET verified = TRUE, verification_date = CURRENT_TIMESTAMP WHERE user_id = ?',
            [userId]
        );

        if (admin_id) {
            await pool.execute(
                'INSERT INTO AdminAuditLog (admin_user_id, action_type, entity_type, entity_id, description) VALUES (?, "Verify User", "User", ?, ?)',
                [admin_id, userId, `Admin ${admin_id} verified user ${userId}`]
            );
        }

        return NextResponse.json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
