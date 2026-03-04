import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            user_id, bio, profile_image_url, cover_image_url,
            phone_number, date_of_birth, gender, location,
            website_url, social_media_links, primary_interest_category_id,
            secondary_interests, language_preference, timezone
        } = body;

        if (!user_id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const query = `
            INSERT INTO UserProfiles (
                user_id, bio, profile_image_url, cover_image_url, 
                phone_number, date_of_birth, gender, location, 
                website_url, social_media_links, primary_interest_category_id,
                secondary_interests, language_preference, timezone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                bio = VALUES(bio),
                profile_image_url = VALUES(profile_image_url),
                cover_image_url = VALUES(cover_image_url),
                phone_number = VALUES(phone_number),
                date_of_birth = VALUES(date_of_birth),
                gender = VALUES(gender),
                location = VALUES(location),
                website_url = VALUES(website_url),
                social_media_links = VALUES(social_media_links),
                primary_interest_category_id = VALUES(primary_interest_category_id),
                secondary_interests = VALUES(secondary_interests),
                language_preference = VALUES(language_preference),
                timezone = VALUES(timezone)
        `;

        await pool.execute(query, [
            user_id, bio || null, profile_image_url || null, cover_image_url || null,
            phone_number || null, date_of_birth || null, gender || 'Prefer not to say',
            location || null, website_url || null,
            social_media_links ? JSON.stringify(social_media_links) : null,
            primary_interest_category_id || null,
            secondary_interests ? JSON.stringify(secondary_interests) : null,
            language_preference || 'en', timezone || 'UTC'
        ]);

        return NextResponse.json({ message: 'Profile extended successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error extending profile:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
