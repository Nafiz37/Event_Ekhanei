import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const status = searchParams.get('status');

        let query = `
            SELECT u.id, u.name, u.email, u.role, u.phone, u.created_at, u.is_verified,
                   um.is_suspended, um.is_banned, um.warning_level
            FROM Users u
            LEFT JOIN UserModeration um ON u.id = um.user_id
        `;

        const conditions = [];
        const params = [];

        if (role) {
            conditions.push('u.role = ?');
            params.push(role);
        }

        if (status === 'suspended') {
            conditions.push('um.is_suspended = TRUE');
        } else if (status === 'banned') {
            conditions.push('um.is_banned = TRUE');
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
