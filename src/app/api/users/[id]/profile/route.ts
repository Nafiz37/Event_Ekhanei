import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: userId } = await params;

    if (!userId || userId === 'undefined' || userId === 'null') {
        return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
    }

    try {
        const query = `
            SELECT 
                u.id, u.name, u.email, u.role, u.phone, u.profile_image, u.designation, u.is_verified,
                up.bio, up.profile_image_url, up.cover_image_url, up.phone_number,
                up.date_of_birth, up.gender, up.location, up.website_url,
                up.social_media_links, up.badges, up.verified as profile_verified,
                up.verification_date, up.language_preference, up.timezone,
                c.name as primary_interest_name
            FROM Users u
            LEFT JOIN UserProfiles up ON u.id = up.user_id
            LEFT JOIN Categories c ON up.primary_interest_category_id = c.category_id
            WHERE u.id = ?
        `;

        const [rows]: any = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const user = rows[0];

        // Safe JSON parsing helper
        const safeParse = (val: any) => {
            if (typeof val === 'string') {
                try {
                    return JSON.parse(val);
                } catch (e) {
                    return val;
                }
            }
            return val;
        };

        user.social_media_links = safeParse(user.social_media_links);
        user.badges = safeParse(user.badges);

        // Add ticket and organized counts
        const [[{ organized }]] = await pool.query('SELECT COUNT(*) as organized FROM Events WHERE organizer_id = ?', [userId]) as any;
        const [[{ tickets }]] = await pool.query('SELECT COUNT(*) as tickets FROM Bookings WHERE user_id = ? AND status = "VALID"', [userId]) as any;

        user.events_organized = organized || 0;
        user.events_attended = tickets || 0; // Keeping the name same to avoid UI changes
        user.total_tickets = tickets || 0;

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
