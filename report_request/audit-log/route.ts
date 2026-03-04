import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const adminId = searchParams.get('admin_id');
        const entityType = searchParams.get('entity_type');

        let query = 'SELECT a.*, u.name as admin_name FROM AdminAuditLog a JOIN Users u ON a.admin_user_id = u.id';
        const params = [];

        if (adminId) {
            query += ' WHERE a.admin_user_id = ?';
            params.push(adminId);
        }

        if (entityType) {
            query += (params.length > 0 ? ' AND ' : ' WHERE ') + 'a.entity_type = ?';
            params.push(entityType);
        }

        query += ' ORDER BY a.timestamp DESC LIMIT 100';

        const [rows] = await pool.query(query, params);

        const processedRows = (rows as any[]).map(row => ({
            ...row,
            old_values: row.old_values ? JSON.parse(row.old_values) : null,
            new_values: row.new_values ? JSON.parse(row.new_values) : null
        }));

        return NextResponse.json(processedRows);
    } catch (error) {
        console.error('Error fetching audit log:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
