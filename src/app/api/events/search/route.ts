import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const categoryId = searchParams.get('category_id');
        const venueId = searchParams.get('venue_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const minPrice = searchParams.get('min_price');
        const maxPrice = searchParams.get('max_price');
        const tags = searchParams.get('tags'); // comma separated

        let sql = `
            SELECT DISTINCT
                e.*, 
                v.name as venue_name, v.city as venue_city,
                c.name as category_name
            FROM Events e
            LEFT JOIN Venues v ON e.venue_id = v.venue_id
            LEFT JOIN Categories c ON e.category_id = c.category_id
            LEFT JOIN TicketTypes tt ON e.event_id = tt.event_id
            LEFT JOIN EventTags et ON e.event_id = et.event_id
            WHERE e.status = 'PUBLISHED'
        `;

        const params: any[] = [];

        if (query) {
            sql += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
            params.push(`%${query}%`, `%${query}%`);
        }

        if (categoryId) {
            sql += ` AND e.category_id = ?`;
            params.push(categoryId);
        }

        if (venueId) {
            sql += ` AND e.venue_id = ?`;
            params.push(venueId);
        }

        if (startDate) {
            sql += ` AND e.start_time >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            sql += ` AND e.end_time <= ?`;
            params.push(endDate);
        }

        if (minPrice) {
            sql += ` AND tt.price >= ?`;
            params.push(minPrice);
        }

        if (maxPrice) {
            sql += ` AND tt.price <= ?`;
            params.push(maxPrice);
        }

        if (tags) {
            const tagList = tags.split(',');
            sql += ` AND et.tag_name IN (${tagList.map(() => '?').join(',')})`;
            params.push(...tagList);
        }

        sql += ` ORDER BY e.start_time ASC`;

        const [rows] = await pool.query(sql, params);

        // Log search history if user_id is provided
        const userId = searchParams.get('user_id');
        if (userId && query) {
            await pool.execute(
                'INSERT INTO SearchHistory (user_id, search_query, search_type, results_count) VALUES (?, ?, "Event", ?)',
                [userId, query, (rows as any[]).length]
            );
        }

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error searching events:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
