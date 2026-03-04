USE event_koi;
-- =====================================================
-- STEP 1: ENHANCE SCHEMA FOR NESTED EVENTS
-- =====================================================
-- Add self-referencing parent_event_id to handle Fests/Sub-events
ALTER TABLE Events
ADD COLUMN parent_event_id INT DEFAULT NULL,
    ADD CONSTRAINT fk_parent_event FOREIGN KEY (parent_event_id) REFERENCES Events(event_id) ON DELETE CASCADE;
-- Add event_type to distinguish between a Main Fest and a Sub-event/Competition
ALTER TABLE Events
ADD COLUMN event_type ENUM(
        'FEST',
        'SINGLE',
        'COMPETITION',
        'WORKSHOP',
        'SESSION'
    ) DEFAULT 'SINGLE';
-- =====================================================
-- STEP 2: CREATE THE JAVA FEST (PARENT)
-- =====================================================
INSERT INTO Events (
        title,
        description,
        category_id,
        venue_id,
        organizer_id,
        start_time,
        end_time,
        status,
        event_type
    )
VALUES (
        'Java Fest 2026',
        'The largest Java developer gathering in the region. Workshops, competitions, and networking for the JVM community.',
        2,
        1,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),
        'PUBLISHED',
        'FEST'
    );
SET @fest_id = LAST_INSERT_ID();
-- =====================================================
-- STEP 3: CREATE SUB-EVENTS / COMPETITIONS (CHILDREN)
-- =====================================================
INSERT INTO Events (
        title,
        description,
        category_id,
        venue_id,
        organizer_id,
        start_time,
        end_time,
        status,
        event_type,
        parent_event_id
    )
VALUES (
        'Java Hackathon 48h',
        'A 48-hour coding marathon building JVM-based solutions for real-world problems.',
        2,
        1,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        'PUBLISHED',
        'COMPETITION',
        @fest_id
    ),
    (
        'DevOps Java Challenge',
        'Compete in setting up high-availability pipelines for Spring Boot microservices.',
        2,
        3,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        'PUBLISHED',
        'COMPETITION',
        @fest_id
    ),
    (
        'Algo-Mania (Java Edition)',
        'Fast-paced competitive programming contest using Java only.',
        2,
        4,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),
        'PUBLISHED',
        'COMPETITION',
        @fest_id
    ),
    (
        'Modern Java Workshop',
        'Deep dive into Java 21+ features like Virtual Threads and Pattern Matching.',
        2,
        2,
        51,
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),
        'PUBLISHED',
        'WORKSHOP',
        @fest_id
    );
-- =====================================================
-- STEP 4: ADD TICKET TYPES FOR SUB-EVENTS
-- =====================================================
-- For the main fest (General Entry)
INSERT INTO TicketTypes (event_id, name, description, price, quantity)
VALUES (
        @fest_id,
        'Fest All-Access Pass',
        'Entry to the venue and all talks for both days.',
        3000.00,
        500
    );
-- For specific competitions (Competition Fee)
INSERT INTO TicketTypes (event_id, name, description, price, quantity)
SELECT event_id,
    'Competition Entry',
    'Registration fee for this specific competition.',
    500.00,
    50
FROM Events
WHERE parent_event_id = @fest_id;