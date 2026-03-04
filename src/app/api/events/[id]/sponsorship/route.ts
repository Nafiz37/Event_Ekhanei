import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const [packages] = await pool.query('SELECT * FROM SponsorshipPackages WHERE event_id = ?', [id]);
        const [sponsors] = await pool.query(`
            SELECT es.*, s.name as sponsor_name 
            FROM EventSponsorships es
            JOIN Sponsors s ON es.sponsor_id = s.sponsor_id
            WHERE es.event_id = ?
        `, [id]);

        return NextResponse.json({ packages, sponsors });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sponsorship data' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { sponsor_id, package_id, amount_paid, payment_status } = body;

        await pool.execute(`
            INSERT INTO EventSponsorships (event_id, sponsor_id, package_id, amount_paid, payment_status)
            VALUES (?, ?, ?, ?, ?)
        `, [id, sponsor_id, package_id, amount_paid, payment_status]);

        // Increment slots taken
        if (package_id) {
            await pool.execute('UPDATE SponsorshipPackages SET slots_taken = slots_taken + 1 WHERE package_id = ?', [package_id]);
        }

        return NextResponse.json({ message: 'Sponsorship added successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error adding sponsorship' }, { status: 500 });
    }
}
