import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const body = await request.json();
        const { admin_id, reason } = body;

        await pool.execute(
            `INSERT INTO UserModeration (user_id, is_banned, ban_reason, banned_by_admin, ban_date) 
             VALUES (?, TRUE, ?, ?, CURRENT_TIMESTAMP)
             ON DUPLICATE KEY UPDATE
                is_banned = TRUE,
                ban_reason = VALUES(ban_reason),
                banned_by_admin = VALUES(banned_by_admin),
                ban_date = CURRENT_TIMESTAMP`,
            [userId, reason || 'No reason provided', admin_id]
        );

        if (admin_id) {
            await pool.execute(
                'INSERT INTO AdminAuditLog (admin_user_id, action_type, entity_type, entity_id, description) VALUES (?, "Ban User", "User", ?, ?)',
                [admin_id, userId, `Admin ${admin_id} banned user ${userId}`]
            );
        }

        return NextResponse.json({ message: 'User banned successfully' });
    } catch (error) {
        console.error('Error banning user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
