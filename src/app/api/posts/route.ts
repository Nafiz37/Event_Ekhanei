import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('event_id');
        const userId = searchParams.get('user_id'); // Current user to check if liked

        if (!eventId) {
            return NextResponse.json({ message: 'Event ID required' }, { status: 400 });
        }

        const query = `
            SELECT 
                p.*,
                u.name as author_name,
                u.profile_image as author_image,
                (SELECT COUNT(*) FROM PostLikes WHERE post_id = p.post_id) as like_count,
                (SELECT COUNT(*) > 0 FROM PostLikes WHERE post_id = p.post_id AND user_id = ?) as is_liked
            FROM EventPosts p
            JOIN Users u ON p.user_id = u.id
            WHERE p.event_id = ?
            ORDER BY p.created_at DESC
        `;

        const [posts] = await pool.query(query, [userId || 0, eventId]);

        // For each post, get comments
        for (const post of (posts as any[])) {
            const [comments] = await pool.query(`
                SELECT c.*, u.name as user_name, u.profile_image 
                FROM PostComments c
                JOIN Users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at ASC
            `, [post.post_id]);
            post.comments = comments;
        }

        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const event_id = formData.get('event_id');
        const user_id = formData.get('user_id');
        const content = formData.get('content');
        const image = formData.get('image'); // Simplified: Expecting URL or we handle upload separately. 
        // For simplicity in this env, let's assume image is just a string URL or we skip complex upload logic for now
        // Or if it IS a file, we need the upload logic.
        // Let's stick to text content first or basic URL input for image to keep it reliable. 
        // If user sends file, we need the save logic. I'll check previous upload implementation.
        // Previous uses `fs` to save to public. I will replicate simplified version or just take text for now if easiest.
        // User asked for "authenticity" so image is good. I'll implement basic file save.

        // Re-using file save logic from `user/profile/route.ts` if possible.
        // Let's copy it here briefly.

        let image_url = null;
        if (image && typeof image === 'object' && (image as any).name) {
            const file = image as File;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Save to public/uploads
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const fileName = `post-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, buffer);
            image_url = `/uploads/${fileName}`;
        }

        const [result] = await pool.execute(
            'INSERT INTO EventPosts (event_id, user_id, content, image_url) VALUES (?, ?, ?, ?)',
            [event_id, user_id, content, image_url]
        );

        return NextResponse.json({ message: 'Post created', post_id: (result as any).insertId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
    }
}
