USE event_koi;
-- Clear previous seeds for these specific expansion tables
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE UserProfiles;
TRUNCATE TABLE UserFollowing;
TRUNCATE TABLE UserAchievements;
TRUNCATE TABLE UserPreferences;
TRUNCATE TABLE EventTags;
TRUNCATE TABLE EventSchedule;
TRUNCATE TABLE EventReviews;
TRUNCATE TABLE Payments;
TRUNCATE TABLE EventRevenue;
TRUNCATE TABLE ReportedContent;
TRUNCATE TABLE DailyMetrics;
TRUNCATE TABLE EventAnalytics;
TRUNCATE TABLE SponsorshipPackages;
TRUNCATE TABLE EventSponsorships;
SET FOREIGN_KEY_CHECKS = 1;
-- =====================================================
-- Tier 2: User & Profile Management SEEDS
-- =====================================================
INSERT INTO UserProfiles (
        user_id,
        bio,
        location,
        website_url,
        gender,
        date_of_birth,
        social_media_links,
        language_preference
    )
SELECT id,
    CONCAT(
        'Hi, I am ',
        name,
        '. Passionate about local events in Bangladesh.'
    ),
    CASE
        WHEN id % 2 = 0 THEN 'Dhaka'
        ELSE 'Chittagong'
    END,
    CONCAT(
        'https://',
        REPLACE(LOWER(name), ' ', ''),
        '.com'
    ),
    CASE
        WHEN id % 2 = 0 THEN 'Male'
        ELSE 'Female'
    END,
    DATE_SUB(CURRENT_DATE, INTERVAL (20 + (id % 20)) YEAR),
    JSON_OBJECT('twitter', '@user', 'linkedin', 'in/user'),
    'en'
FROM Users
LIMIT 100;
INSERT INTO UserFollowing (follower_user_id, following_user_id)
SELECT u1.id,
    u2.id
FROM Users u1,
    Users u2
WHERE u1.id <> u2.id
    AND (u1.id + u2.id) % 9 = 0
LIMIT 150;
-- =====================================================
-- Tier 3: Event Advanced Features SEEDS
-- =====================================================
INSERT INTO EventTags (event_id, tag_name)
SELECT event_id,
    tag
FROM Events
    CROSS JOIN (
        SELECT 'Popular' as tag
        UNION
        SELECT 'Inside'
        UNION
        SELECT 'Tech'
    ) t
WHERE (event_id + LENGTH(tag)) % 4 = 0;
INSERT INTO EventSchedule (
        event_id,
        session_name,
        description,
        start_time,
        end_time,
        location
    )
SELECT event_id,
    'Main Session',
    'The core part of the event.',
    start_time,
    DATE_ADD(start_time, INTERVAL 4 HOUR),
    'Grand Ballroom'
FROM Events;
INSERT IGNORE INTO EventReviews (event_id, user_id, rating, title, content)
SELECT b.event_id,
    b.user_id,
    (b.booking_id % 2) + 4,
    'Amazing!',
    'Had a wonderful time at this event.'
FROM Bookings b
WHERE b.status = 'VALID'
LIMIT 40;
-- =====================================================
-- Tier 4: Revenue & Finance SEEDS
-- =====================================================
INSERT INTO Payments (
        booking_id,
        user_id,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        paid_at
    )
SELECT b.booking_id,
    b.user_id,
    tt.price,
    'Mobile Wallet',
    'Completed',
    CONCAT('TXN-', UUID_SHORT()),
    b.created_at
FROM Bookings b
    JOIN TicketTypes tt ON b.ticket_type_id = tt.ticket_type_id
WHERE b.status = 'VALID';
INSERT INTO EventRevenue (
        event_id,
        total_ticket_revenue,
        service_fees,
        net_revenue,
        report_date
    )
SELECT b.event_id,
    SUM(tt.price),
    SUM(tt.price) * 0.10,
    SUM(tt.price) * 0.90,
    CURRENT_DATE
FROM Bookings b
    JOIN TicketTypes tt ON b.ticket_type_id = tt.ticket_type_id
WHERE b.status = 'VALID'
GROUP BY b.event_id;
-- =====================================================
-- Tier 5: Admin & Moderation SEEDS
-- =====================================================
INSERT IGNORE INTO AdminRoles (role_name, description, permissions)
VALUES ('SuperAdmin', 'All platform access', '["*"]'),
    (
        'Moderator',
        'Manage reports and users',
        '["reports", "users"]'
    );
INSERT IGNORE INTO AdminUsers (user_id, role_id, department)
SELECT id,
    1,
    'Core'
FROM Users
WHERE role = 'admin'
LIMIT 2;
INSERT INTO ReportedContent (
        reported_by_user_id,
        content_type,
        content_id,
        reason,
        description
    )
SELECT id,
    'User',
    51,
    'Spam',
    'Testing reporting system'
FROM Users
WHERE id % 15 = 0
LIMIT 5;
-- =====================================================
-- Tier 6: Analytics & Reporting SEEDS
-- =====================================================
INSERT INTO DailyMetrics (
        metric_date,
        new_users,
        new_events,
        total_bookings,
        total_revenue
    )
VALUES (
        DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY),
        10,
        1,
        15,
        5000.00
    ),
    (
        DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY),
        8,
        2,
        12,
        4200.00
    );
INSERT INTO EventAnalytics (
        event_id,
        total_views,
        unique_visitors,
        conversion_rate,
        captured_date
    )
SELECT event_id,
    1000,
    450,
    15.5,
    CURRENT_DATE
FROM Events;
-- =====================================================
-- Tier 8: Sponsorship System SEEDS
-- =====================================================
INSERT INTO SponsorshipPackages (event_id, name, price, benefits, max_slots)
SELECT event_id,
    'Platinum Package',
    100000.00,
    'All access, VIP Lounge',
    2
FROM Events
LIMIT 5;
INSERT INTO EventSponsorships (
        event_id,
        sponsor_id,
        package_id,
        amount_paid,
        payment_status
    )
SELECT p.event_id,
    1,
    p.package_id,
    p.price,
    'Completed'
FROM SponsorshipPackages p
LIMIT 5;