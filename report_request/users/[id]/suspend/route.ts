import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const body = await request.json();
        const { admin_id, reason, duration_days } = body;

        const suspension_end = duration_days ? new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000) : null;

        await pool.execute(
            `INSERT INTO UserModeration (user_id, is_suspended, suspension_reason, suspended_by_admin, suspension_start, suspension_end) 
             VALUES (?, TRUE, ?, ?, CURRENT_TIMESTAMP, ?)
             ON DUPLICATE KEY UPDATE
                is_suspended = TRUE,
                suspension_reason = VALUES(suspension_reason),
                suspended_by_admin = VALUES(suspended_by_admin),
                suspension_start = CURRENT_TIMESTAMP,
                suspension_end = VALUES(suspension_end)`,
            [userId, reason || 'No reason provided', admin_id, suspension_end]
        );

        if (admin_id) {
            await pool.execute(
                'INSERT INTO AdminAuditLog (admin_user_id, action_type, entity_type, entity_id, description) VALUES (?, "Suspend User", "User", ?, ?)',
                [admin_id, userId, `Admin ${admin_id} suspended user ${userId} until ${suspension_end || 'indefinitely'}`]
            );
        }

        return NextResponse.json({ message: 'User suspended successfully' });
    } catch (error) {
        console.error('Error suspending user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
