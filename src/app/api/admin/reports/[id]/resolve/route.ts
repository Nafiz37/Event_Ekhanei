import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { status, action_taken, resolution_notes, admin_id } = body;

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            await connection.execute(`
                UPDATE ReportedContent 
                SET status = ?, 
                    action_taken = ?, 
                    resolution_notes = ?, 
                    assigned_to_admin = ?,
                    resolved_date = CURRENT_TIMESTAMP
                WHERE report_id = ?
            `, [status, action_taken || null, resolution_notes || null, admin_id || null, id]);

            // Add to audit log
            await connection.execute(`
                INSERT INTO AdminAuditLog (admin_user_id, action_type, entity_type, entity_id, description)
                VALUES (?, 'RESOLVE_REPORT', 'ReportedContent', ?, ?)
            `, [admin_id, id, `Report resolved with status ${status} and action ${action_taken || 'None'}`]);

            await connection.commit();
            return NextResponse.json({ message: 'Report resolved successfully' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Resolve report error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
