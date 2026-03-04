USE event_koi;
-- =====================================================
-- SEEDING 20 FUTURE EVENTS
-- =====================================================
INSERT INTO Events (
        title,
        description,
        category_id,
        venue_id,
        organizer_id,
        start_time,
        end_time,
        status
    )
VALUES (
        'Dhaka Tech Summit 2026',
        'A massive gathering of tech enthusiasts and startups in Dhaka.',
        2,
        3,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),
        'PUBLISHED'
    ),
    (
        'Symphony of the Night',
        'An orchestral performance featuring modern and classical masterpieces.',
        1,
        4,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),
        'PUBLISHED'
    ),
    (
        'Modern Art Exhibition',
        'Exploring the boundaries of contemporary art in Bangladesh.',
        3,
        2,
        2,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),
        'PUBLISHED'
    ),
    (
        'Startup Connect Networking',
        'Meet founders and investors to take your startup to the next level.',
        5,
        2,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        'PUBLISHED'
    ),
    (
        'Global Business Forum',
        'International business leaders discuss the future of global trade.',
        4,
        4,
        3,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),
        'PUBLISHED'
    ),
    (
        'Dhaka Jazz Night',
        'A smooth evening of jazz and blues at the outdoor plaza.',
        1,
        5,
        1,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),
        'PUBLISHED'
    ),
    (
        'The Future of AI Workshop',
        'Hands-on workshop for building AI solutions with modern frameworks.',
        2,
        2,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),
        'PUBLISHED'
    ),
    (
        'Sustainable Living Expo',
        'Promoting eco-friendly products and sustainable lifestyle choices.',
        4,
        3,
        2,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),
        'PUBLISHED'
    ),
    (
        'Rock Fest 2026',
        'The biggest rock concert of the year featuring local and international bands.',
        1,
        1,
        1,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),
        'PUBLISHED'
    ),
    (
        'Photography Masterclass',
        'Learn professional photography techniques from industry experts.',
        3,
        2,
        3,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),
        'PUBLISHED'
    ),
    (
        'Mobile Dev Conference',
        'A dedicated event for Android and iOS developers.',
        2,
        4,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 58 DAY),
        'PUBLISHED'
    ),
    (
        'Dhaka Food & Culture Festival',
        'Celebrating the rich culinary heritage of Bangladesh.',
        5,
        5,
        2,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 65 DAY),
        'PUBLISHED'
    ),
    (
        'Virtual Reality Expo',
        'Experience the latest innovations in VR and AR technology.',
        2,
        3,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 70 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 72 DAY),
        'PUBLISHED'
    ),
    (
        'Startup Pitch Night',
        'Selected startups pitch their ideas to a panel of venture capitalists.',
        4,
        2,
        3,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 DAY),
        'PUBLISHED'
    ),
    (
        'Classical Dance Evening',
        'A graceful performance of traditional Bangladeshi dances.',
        3,
        4,
        1,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 80 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 81 DAY),
        'PUBLISHED'
    ),
    (
        'The Future of Fintech',
        'Banking and finance leaders explore digital transformation.',
        4,
        2,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 85 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 86 DAY),
        'PUBLISHED'
    ),
    (
        'Outdoor Movie Marathon',
        'Clasissic movies under the stars with food and drinks.',
        1,
        5,
        1,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 91 DAY),
        'PUBLISHED'
    ),
    (
        'Women in Tech Summit',
        'Empowering women in the technology sector through sessions and networking.',
        2,
        1,
        2,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 95 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 97 DAY),
        'PUBLISHED'
    ),
    (
        'Digital Marketing Workshop',
        'Master SEO, SEM, and social media strategies for your business.',
        4,
        2,
        3,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 100 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 101 DAY),
        'PUBLISHED'
    ),
    (
        'The Art of Calligraphy',
        'A workshop on traditional and modern calligraphy techniques.',
        3,
        2,
        1,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 105 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 106 DAY),
        'PUBLISHED'
    );
-- =====================================================
-- TICKET TYPES FOR THESE EVENTS
-- =====================================================
-- Get the IDs of the 20 newly inserted events
SET @first_new_event_id = (
        SELECT LAST_INSERT_ID()
    );
-- Insert Regular and VIP tickets for each
INSERT INTO TicketTypes (event_id, name, description, price, quantity)
SELECT event_id,
    'Regular Ticket',
    'Standard entry to the event.',
    CASE
        WHEN category_id = 1 THEN 1500.00
        WHEN category_id = 2 THEN 2500.00
        ELSE 1000.00
    END,
    200
FROM Events
WHERE event_id >= @first_new_event_id;
INSERT INTO TicketTypes (event_id, name, description, price, quantity)
SELECT event_id,
    'VIP Access',
    'Premium seating and exclusive perks.',
    CASE
        WHEN category_id = 1 THEN 3500.00
        WHEN category_id = 2 THEN 5000.00
        ELSE 2500.00
    END,
    50
FROM Events
WHERE event_id >= @first_new_event_id;