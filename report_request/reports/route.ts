import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    try {
        let query = `
            SELECT 
                r.*, 
                u.name as reported_by_name,
                admin.name as assigned_to_name
            FROM ReportedContent r
            LEFT JOIN Users u ON r.reported_by_user_id = u.id
            LEFT JOIN Users admin ON r.assigned_to_admin = admin.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (status) {
            query += ' AND r.status = ?';
            params.push(status);
        }
        if (type) {
            query += ' AND r.content_type = ?';
            params.push(type);
        }

        query += ' ORDER BY r.reported_date DESC';

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Fetch reports error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { reported_by_user_id, content_type, content_id, reason, description } = body;

        if (!reported_by_user_id || !content_type || !content_id) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const [result]: any = await pool.execute(`
            INSERT INTO ReportedContent (reported_by_user_id, content_type, content_id, reason, description)
            VALUES (?, ?, ?, ?, ?)
        `, [reported_by_user_id, content_type, content_id, reason, description]);

        return NextResponse.json({
            message: 'Report submitted successfully',
            report_id: result.insertId
        });
    } catch (error) {
        console.error('Submit report error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
