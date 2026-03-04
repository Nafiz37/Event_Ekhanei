import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const user_id = formData.get('user_id') as string;
        const designation = formData.get('designation') as string;
        const bio = formData.get('bio') as string;
        const location = formData.get('location') as string;
        const website_url = formData.get('website_url') as string;

        const profile_image = formData.get('profile_image') as File | null;
        const organization_id_card = formData.get('organization_id_card') as File | null;
        const proof_document = formData.get('proof_document') as File | null;

        if (!user_id) {
            return NextResponse.json({ message: 'User ID required' }, { status: 400 });
        }

        // Helper to save file
        const saveFile = async (file: File) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${user_id}_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');

            try {
                await mkdir(uploadDir, { recursive: true });
                await writeFile(path.join(uploadDir, filename), buffer);
                return `/uploads/${filename}`;
            } catch (err) {
                console.error("File save error", err);
                return null;
            }
        };

        let profilePath, idCardPath, proofPath;
        if (profile_image) profilePath = await saveFile(profile_image);
        if (organization_id_card) idCardPath = await saveFile(organization_id_card);
        if (proof_document) proofPath = await saveFile(proof_document);

        // Update Users table for existing fields
        let userUpdateQuery = 'UPDATE Users SET designation = ?';
        const userParams: any[] = [designation];

        if (profilePath) {
            userUpdateQuery += ', profile_image = ?';
            userParams.push(profilePath);
        }
        if (idCardPath) {
            userUpdateQuery += ', organization_id_card = ?';
            userParams.push(idCardPath);
        }
        if (proofPath) {
            userUpdateQuery += ', proof_document = ?';
            userParams.push(proofPath);
        }

        userUpdateQuery += ' WHERE id = ?';
        userParams.push(user_id);

        await pool.execute(userUpdateQuery, userParams);

        // Upsert into UserProfiles for extended fields
        await pool.execute(`
            INSERT INTO UserProfiles (user_id, bio, location, website_url)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                bio = VALUES(bio),
                location = VALUES(location),
                website_url = VALUES(website_url)
        `, [user_id, bio || null, location || null, website_url || null]);

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ message: 'Missing userId' }, { status: 400 });

    try {
        const [rows]: any = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.role, u.phone, u.created_at, 
                u.profile_image, u.designation, u.is_verified, 
                u.organization_id_card, u.proof_document,
                up.bio, up.location, up.website_url,
                (SELECT COUNT(*) FROM Events WHERE organizer_id = u.id) as events_organized,
                (SELECT COUNT(DISTINCT event_id) FROM Bookings WHERE user_id = u.id AND status = 'VALID') as events_attended
            FROM Users u
            LEFT JOIN UserProfiles up ON u.id = up.user_id
            WHERE u.id = ?
        `, [userId]);

        if (rows.length === 0) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Fetch profile error:', error);
        return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
    }
}
