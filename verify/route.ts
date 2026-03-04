import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user_id, doc_url } = body;

        if (!user_id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // We'll update the UserProfiles table to mark it as in review or something similar.
        // For now, let's just update the status in UserProfiles (if we had a status column)
        // Since the schema says 'verified BOOLEAN', we might need more logic or just an audit log.
        // Let's create an Entry in ReportedContent as a 'verification request' maybe?
        // Or just update UserProfiles.

        await pool.execute(
            'UPDATE UserProfiles SET verified = FALSE, verification_date = NULL WHERE user_id = ?',
            [user_id]
        );

        // Actually, the user guide says "request verification". This implies an admin should approve it.
        // So we should probably insert into ReportedContent or a new table if we had one.
        // Given Tier 5 ReportedContent has content_type ENUM('User'...), we can use that.

        await pool.execute(
            'INSERT INTO ReportedContent (reported_by_user_id, content_type, content_id, reason, description) VALUES (?, "User", ?, "Verification Request", ?)',
            [user_id, user_id, `User requested verification. Document URL: ${doc_url || 'N/A'}`]
        );

        return NextResponse.json({ message: 'Verification request submitted successfully' });
    } catch (error) {
        console.error('Error requesting verification:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
