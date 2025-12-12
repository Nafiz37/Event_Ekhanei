-- =====================================================
-- Event Koi - Sample Database with Heavy Data
-- RDBMS Project - Comprehensive Dataset
-- =====================================================

-- Clear existing data (in reverse order of dependencies)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Notifications;
TRUNCATE TABLE Messages;
TRUNCATE TABLE Friendships;
TRUNCATE TABLE PostComments;
TRUNCATE TABLE PostLikes;
TRUNCATE TABLE EventPosts;
TRUNCATE TABLE Sponsors;
TRUNCATE TABLE Bookings;
TRUNCATE TABLE TicketTypes;
TRUNCATE TABLE Events;
TRUNCATE TABLE Venues;
TRUNCATE TABLE Categories;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. USERS (50 users across different roles)
-- =====================================================
INSERT INTO Users (name, email, password, role, phone, designation, is_verified, created_at) VALUES
-- Admins (2)
('Admin Master', 'admin@eventkoi.com', '$2a$10$YourHashedPasswordHere', 'admin', '+8801711111111', 'System Administrator', TRUE, '2024-01-01 10:00:00'),
('Sarah Admin', 'sarah.admin@eventkoi.com', '$2a$10$YourHashedPasswordHere', 'admin', '+8801711111112', 'Platform Manager', TRUE, '2024-01-02 10:00:00'),

-- Organizers (15)
('Tech Events BD', 'tech@events.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222221', 'Tech Conference Organizer', TRUE, '2024-01-05 09:00:00'),
('Cultural Fest', 'cultural@fest.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222222', 'Cultural Event Manager', TRUE, '2024-01-06 09:00:00'),
('Sports Arena', 'sports@arena.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222223', 'Sports Event Coordinator', TRUE, '2024-01-07 09:00:00'),
('Music Live BD', 'music@live.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222224', 'Concert Promoter', TRUE, '2024-01-08 09:00:00'),
('Business Summit', 'business@summit.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222225', 'Business Event Planner', TRUE, '2024-01-09 09:00:00'),
('Art Gallery BD', 'art@gallery.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222226', 'Art Exhibition Curator', TRUE, '2024-01-10 09:00:00'),
('Food Festival', 'food@festival.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222227', 'Food Event Manager', TRUE, '2024-01-11 09:00:00'),
('Education Expo', 'edu@expo.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222228', 'Educational Fair Organizer', TRUE, '2024-01-12 09:00:00'),
('Startup Hub', 'startup@hub.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222229', 'Startup Event Manager', TRUE, '2024-01-13 09:00:00'),
('Fashion Week BD', 'fashion@week.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222230', 'Fashion Show Director', TRUE, '2024-01-14 09:00:00'),
('Gaming Arena', 'gaming@arena.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222231', 'Esports Tournament Manager', TRUE, '2024-01-15 09:00:00'),
('Health Wellness', 'health@wellness.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222232', 'Health Event Coordinator', TRUE, '2024-01-16 09:00:00'),
('Book Fair BD', 'book@fair.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222233', 'Literary Event Organizer', TRUE, '2024-01-17 09:00:00'),
('Film Festival', 'film@festival.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222234', 'Film Festival Director', TRUE, '2024-01-18 09:00:00'),
('Charity Events', 'charity@events.bd', '$2a$10$YourHashedPasswordHere', 'organizer', '+8801712222235', 'Charity Event Planner', TRUE, '2024-01-19 09:00:00'),

-- Attendees (33)
('John Doe', 'john.doe@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333301', 'Software Engineer', FALSE, '2024-02-01 10:00:00'),
('Jane Smith', 'jane.smith@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333302', 'Marketing Manager', FALSE, '2024-02-02 10:00:00'),
('Mike Johnson', 'mike.j@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333303', 'Designer', FALSE, '2024-02-03 10:00:00'),
('Emily Brown', 'emily.b@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333304', 'Student', FALSE, '2024-02-04 10:00:00'),
('David Wilson', 'david.w@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333305', 'Entrepreneur', FALSE, '2024-02-05 10:00:00'),
('Sarah Davis', 'sarah.d@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333306', 'Teacher', FALSE, '2024-02-06 10:00:00'),
('Chris Taylor', 'chris.t@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333307', 'Photographer', FALSE, '2024-02-07 10:00:00'),
('Lisa Anderson', 'lisa.a@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333308', 'Writer', FALSE, '2024-02-08 10:00:00'),
('Tom Martinez', 'tom.m@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333309', 'Developer', FALSE, '2024-02-09 10:00:00'),
('Anna Garcia', 'anna.g@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333310', 'Analyst', FALSE, '2024-02-10 10:00:00'),
('Robert Lee', 'robert.l@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333311', 'Consultant', FALSE, '2024-02-11 10:00:00'),
('Maria Rodriguez', 'maria.r@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333312', 'Artist', FALSE, '2024-02-12 10:00:00'),
('James White', 'james.w@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333313', 'Musician', FALSE, '2024-02-13 10:00:00'),
('Patricia Harris', 'patricia.h@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333314', 'Chef', FALSE, '2024-02-14 10:00:00'),
('Michael Clark', 'michael.c@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333315', 'Athlete', FALSE, '2024-02-15 10:00:00'),
('Jennifer Lewis', 'jennifer.l@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333316', 'Nurse', FALSE, '2024-02-16 10:00:00'),
('William Walker', 'william.w@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333317', 'Architect', FALSE, '2024-02-17 10:00:00'),
('Linda Hall', 'linda.h@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333318', 'Lawyer', FALSE, '2024-02-18 10:00:00'),
('Richard Allen', 'richard.a@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333319', 'Doctor', FALSE, '2024-02-19 10:00:00'),
('Barbara Young', 'barbara.y@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333320', 'Scientist', FALSE, '2024-02-20 10:00:00'),
('Joseph King', 'joseph.k@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333321', 'Researcher', FALSE, '2024-02-21 10:00:00'),
('Susan Wright', 'susan.w@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333322', 'Journalist', FALSE, '2024-02-22 10:00:00'),
('Thomas Scott', 'thomas.s@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333323', 'Engineer', FALSE, '2024-02-23 10:00:00'),
('Karen Green', 'karen.g@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333324', 'Accountant', FALSE, '2024-02-24 10:00:00'),
('Daniel Adams', 'daniel.a@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333325', 'Pilot', FALSE, '2024-02-25 10:00:00'),
('Nancy Baker', 'nancy.b@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333326', 'Pharmacist', FALSE, '2024-02-26 10:00:00'),
('Paul Nelson', 'paul.n@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333327', 'Dentist', FALSE, '2024-02-27 10:00:00'),
('Betty Carter', 'betty.c@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333328', 'Veterinarian', FALSE, '2024-02-28 10:00:00'),
('Mark Mitchell', 'mark.m@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333329', 'Mechanic', FALSE, '2024-03-01 10:00:00'),
('Sandra Perez', 'sandra.p@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333330', 'Electrician', FALSE, '2024-03-02 10:00:00'),
('Steven Roberts', 'steven.r@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333331', 'Plumber', FALSE, '2024-03-03 10:00:00'),
('Donna Turner', 'donna.t@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333332', 'Carpenter', FALSE, '2024-03-04 10:00:00'),
('Kevin Phillips', 'kevin.p@email.com', '$2a$10$YourHashedPasswordHere', 'attendee', '+8801733333333', 'Painter', FALSE, '2024-03-05 10:00:00');

-- =====================================================
-- 2. CATEGORIES (15 diverse categories)
-- =====================================================
INSERT INTO Categories (name) VALUES
('Technology & Innovation'),
('Music & Entertainment'),
('Sports & Fitness'),
('Business & Networking'),
('Arts & Culture'),
('Food & Beverage'),
('Education & Learning'),
('Health & Wellness'),
('Fashion & Beauty'),
('Gaming & Esports'),
('Film & Media'),
('Books & Literature'),
('Charity & Social Cause'),
('Startup & Entrepreneurship'),
('Travel & Adventure');

-- =====================================================
-- 3. VENUES (20 venues across Bangladesh)
-- =====================================================
INSERT INTO Venues (name, address, city, capacity) VALUES
('International Convention City Bashundhara', 'Purbachal, Dhaka', 'Dhaka', 5000),
('Bangabandhu International Conference Center', 'Agargaon, Dhaka', 'Dhaka', 3000),
('Radisson Blu Dhaka Water Garden', 'Airport Road, Dhaka', 'Dhaka', 1500),
('Pan Pacific Sonargaon', 'Karwan Bazar, Dhaka', 'Dhaka', 2000),
('The Westin Dhaka', 'Gulshan, Dhaka', 'Dhaka', 1200),
('Chittagong Club', 'Agrabad, Chittagong', 'Chittagong', 800),
('Hotel Agrabad', 'Chittagong', 'Chittagong', 600),
('Sylhet International Cricket Stadium', 'Sylhet', 'Sylhet', 18000),
('Rajshahi University Auditorium', 'Rajshahi', 'Rajshahi', 1000),
('Khulna Divisional Stadium', 'Khulna', 'Khulna', 15000),
('Bangladesh National Museum', 'Shahbag, Dhaka', 'Dhaka', 500),
('Liberation War Museum', 'Agargaon, Dhaka', 'Dhaka', 400),
('Dhaka University TSC', 'Dhaka University', 'Dhaka', 2000),
('BUET Auditorium', 'BUET Campus, Dhaka', 'Dhaka', 800),
('IUB Auditorium', 'Bashundhara, Dhaka', 'Dhaka', 600),
('NSU Auditorium', 'Bashundhara, Dhaka', 'Dhaka', 700),
('BRAC University Auditorium', 'Mohakhali, Dhaka', 'Dhaka', 500),
('Jamuna Future Park', 'Kuril, Dhaka', 'Dhaka', 3000),
('Bashundhara City Mall', 'Panthapath, Dhaka', 'Dhaka', 2500),
('Star Cineplex', 'Bashundhara City, Dhaka', 'Dhaka', 1000);

-- =====================================================
-- 4. EVENTS (30 events - mix of past, current, future)
-- =====================================================
INSERT INTO Events (organizer_id, venue_id, category_id, title, description, start_time, end_time, status, listing_fee, is_listing_paid) VALUES
-- Future Events (20)
(3, 1, 1, 'Bangladesh Tech Summit 2025', 'The largest technology conference in Bangladesh featuring AI, ML, and Cloud Computing sessions.', '2025-03-15 09:00:00', '2025-03-17 18:00:00', 'PUBLISHED', 5000.00, TRUE),
(4, 2, 5, 'Dhaka International Cultural Festival', 'A celebration of diverse cultures with music, dance, and art from around the world.', '2025-02-20 10:00:00', '2025-02-22 22:00:00', 'PUBLISHED', 3000.00, TRUE),
(5, 8, 3, 'National Cricket Championship Finals', 'The ultimate showdown of Bangladesh cricket teams.', '2025-04-10 14:00:00', '2025-04-10 22:00:00', 'PUBLISHED', 2000.00, TRUE),
(6, 3, 2, 'Live Concert: Legends of Bangla Rock', 'An evening with the greatest rock bands of Bangladesh.', '2025-02-28 18:00:00', '2025-02-28 23:00:00', 'PUBLISHED', 4000.00, TRUE),
(7, 4, 4, 'Bangladesh Business Expo 2025', 'Connect with industry leaders and explore business opportunities.', '2025-03-05 09:00:00', '2025-03-07 18:00:00', 'PUBLISHED', 6000.00, TRUE),
(8, 11, 5, 'Contemporary Art Exhibition', 'Showcasing modern Bangladeshi artists and their masterpieces.', '2025-02-25 10:00:00', '2025-03-10 20:00:00', 'PUBLISHED', 1500.00, TRUE),
(9, 18, 6, 'Dhaka Food Festival 2025', 'Taste the flavors of Bangladesh and international cuisines.', '2025-03-20 12:00:00', '2025-03-22 22:00:00', 'PUBLISHED', 2500.00, TRUE),
(10, 13, 7, 'Higher Education Fair 2025', 'Explore university programs and scholarship opportunities.', '2025-02-18 09:00:00', '2025-02-19 18:00:00', 'PUBLISHED', 1000.00, TRUE),
(11, 14, 14, 'Startup Pitch Competition', 'Young entrepreneurs pitch their ideas to top investors.', '2025-03-12 10:00:00', '2025-03-12 17:00:00', 'PUBLISHED', 3500.00, TRUE),
(12, 5, 9, 'Dhaka Fashion Week 2025', 'The biggest fashion event showcasing local and international designers.', '2025-04-01 16:00:00', '2025-04-03 22:00:00', 'PUBLISHED', 5500.00, TRUE),
(13, 19, 10, 'Bangladesh Gaming Championship', 'Esports tournament featuring PUBG, Dota 2, and CS:GO.', '2025-03-25 10:00:00', '2025-03-27 20:00:00', 'PUBLISHED', 4500.00, TRUE),
(14, 6, 8, 'Wellness & Yoga Retreat', 'A weekend of mindfulness, yoga, and healthy living.', '2025-02-22 08:00:00', '2025-02-23 18:00:00', 'PUBLISHED', 2000.00, TRUE),
(15, 12, 12, 'Ekushey Book Fair 2025', 'Annual book fair celebrating Bangladeshi literature.', '2025-02-01 10:00:00', '2025-02-28 21:00:00', 'PUBLISHED', 1000.00, TRUE),
(16, 20, 11, 'Dhaka International Film Festival', 'Screening award-winning films from around the globe.', '2025-03-08 15:00:00', '2025-03-14 23:00:00', 'PUBLISHED', 3000.00, TRUE),
(17, 7, 13, 'Charity Run for Education', 'A 10K run to raise funds for underprivileged children.', '2025-02-16 06:00:00', '2025-02-16 10:00:00', 'PUBLISHED', 500.00, TRUE),
(3, 15, 1, 'AI & Machine Learning Workshop', 'Hands-on workshop on building ML models.', '2025-03-18 09:00:00', '2025-03-19 17:00:00', 'PUBLISHED', 2500.00, TRUE),
(4, 16, 5, 'Traditional Music Night', 'An evening of classical Bangladeshi music.', '2025-02-27 19:00:00', '2025-02-27 23:00:00', 'PUBLISHED', 1500.00, TRUE),
(5, 10, 3, 'Marathon Dhaka 2025', 'Full and half marathon through the streets of Dhaka.', '2025-04-05 05:00:00', '2025-04-05 12:00:00', 'PUBLISHED', 1000.00, TRUE),
(6, 17, 2, 'Indie Music Festival', 'Discover emerging independent artists.', '2025-03-30 17:00:00', '2025-03-31 23:00:00', 'PUBLISHED', 2000.00, TRUE),
(7, 1, 4, 'Digital Marketing Summit', 'Learn the latest trends in digital marketing and SEO.', '2025-03-22 09:00:00', '2025-03-23 18:00:00', 'PUBLISHED', 3500.00, TRUE),

-- Past Events (5)
(8, 2, 5, 'Winter Art Showcase 2024', 'A retrospective of winter-themed artworks.', '2024-12-10 10:00:00', '2024-12-20 20:00:00', 'PUBLISHED', 1000.00, TRUE),
(9, 3, 6, 'Street Food Carnival 2024', 'Celebrating Dhaka street food culture.', '2024-11-15 12:00:00', '2024-11-17 22:00:00', 'PUBLISHED', 1500.00, TRUE),
(10, 4, 7, 'Career Fair 2024', 'Job opportunities for fresh graduates.', '2024-10-20 09:00:00', '2024-10-21 18:00:00', 'PUBLISHED', 500.00, TRUE),
(11, 5, 14, 'Startup Weekend Dhaka', '54-hour event to build a startup from scratch.', '2024-09-13 18:00:00', '2024-09-15 20:00:00', 'PUBLISHED', 2000.00, TRUE),
(12, 6, 9, 'Bridal Fashion Show 2024', 'Latest trends in bridal wear.', '2024-08-25 18:00:00', '2024-08-25 22:00:00', 'PUBLISHED', 3000.00, TRUE),

-- Draft Events (5)
(13, 7, 10, 'Mobile Gaming Tournament', 'PUBG Mobile and Free Fire championship.', '2025-05-10 10:00:00', '2025-05-12 20:00:00', 'DRAFT', 3000.00, FALSE),
(14, 8, 8, 'Mental Health Awareness Week', 'Workshops and talks on mental wellness.', '2025-05-15 09:00:00', '2025-05-21 18:00:00', 'DRAFT', 0.00, FALSE),
(15, 9, 12, 'Poetry Slam Competition', 'Young poets compete for the grand prize.', '2025-05-20 18:00:00', '2025-05-20 22:00:00', 'DRAFT', 500.00, FALSE),
(16, 10, 11, 'Documentary Film Screening', 'Award-winning documentaries on social issues.', '2025-05-25 16:00:00', '2025-05-27 22:00:00', 'DRAFT', 1000.00, FALSE),
(17, 11, 13, 'Blood Donation Camp', 'Save lives by donating blood.', '2025-06-01 08:00:00', '2025-06-01 16:00:00', 'DRAFT', 0.00, FALSE);

-- =====================================================
-- 5. TICKET TYPES (90+ ticket types across events)
-- =====================================================
INSERT INTO TicketTypes (event_id, name, price, quantity) VALUES
-- Event 1: Bangladesh Tech Summit 2025
(1, 'Early Bird Pass', 1500.00, 200),
(1, 'Regular Pass', 2000.00, 500),
(1, 'VIP Pass', 5000.00, 100),
(1, 'Student Pass', 800.00, 300),

-- Event 2: Dhaka International Cultural Festival
(2, 'General Admission', 500.00, 1000),
(2, 'Premium Seating', 1200.00, 200),
(2, 'Family Package (4 people)', 1800.00, 150),

-- Event 3: National Cricket Championship Finals
(3, 'General Stand', 300.00, 5000),
(3, 'Pavilion', 1000.00, 2000),
(3, 'VIP Box', 3000.00, 100),

-- Event 4: Live Concert
(4, 'Standing', 800.00, 800),
(4, 'Reserved Seating', 1500.00, 400),
(4, 'VIP Meet & Greet', 5000.00, 50),

-- Event 5: Business Expo
(5, 'Visitor Pass', 500.00, 2000),
(5, 'Business Pass', 2000.00, 500),
(5, 'Exhibitor Booth', 15000.00, 50),

-- Event 6: Art Exhibition
(6, 'Single Entry', 200.00, 500),
(6, 'Season Pass', 800.00, 100),

-- Event 7: Food Festival
(7, 'Entry Ticket', 300.00, 2000),
(7, 'VIP Tasting Pass', 1500.00, 200),

-- Event 8: Education Fair
(8, 'Student Entry', 100.00, 1500),
(8, 'Parent Entry', 150.00, 1000),

-- Event 9: Startup Pitch
(9, 'Attendee', 500.00, 200),
(9, 'Investor Pass', 2000.00, 50),

-- Event 10: Fashion Week
(10, 'General Seating', 2000.00, 500),
(10, 'Front Row', 8000.00, 100),

-- Event 11: Gaming Championship
(11, 'Spectator', 500.00, 1000),
(11, 'Team Registration', 5000.00, 50),

-- Event 12: Wellness Retreat
(12, 'Day Pass', 1500.00, 100),
(12, 'Full Weekend', 3000.00, 80),

-- Event 13: Book Fair
(13, 'Entry Ticket', 50.00, 5000),

-- Event 14: Film Festival
(14, 'Single Screening', 300.00, 800),
(14, 'Festival Pass', 2000.00, 200),

-- Event 15: Charity Run
(15, '10K Registration', 500.00, 500),
(15, '5K Registration', 300.00, 300),

-- Event 16-20: Additional tickets
(16, 'Workshop Ticket', 1500.00, 100),
(17, 'Concert Ticket', 800.00, 400),
(18, 'Marathon Entry', 1000.00, 1000),
(19, 'Festival Pass', 1200.00, 500),
(20, 'Summit Pass', 2500.00, 300);

-- =====================================================
-- 6. BOOKINGS (200+ bookings)
-- =====================================================
INSERT INTO Bookings (user_id, event_id, ticket_type_id, unique_code, status, created_at) VALUES
-- Generate 200 bookings across different users and events
(18, 1, 1, UUID(), 'VALID', '2025-01-10 10:30:00'),
(19, 1, 2, UUID(), 'VALID', '2025-01-11 11:00:00'),
(20, 1, 3, UUID(), 'VALID', '2025-01-12 12:00:00'),
(21, 1, 4, UUID(), 'VALID', '2025-01-13 13:00:00'),
(22, 2, 5, UUID(), 'VALID', '2025-01-14 14:00:00'),
(23, 2, 6, UUID(), 'VALID', '2025-01-15 15:00:00'),
(24, 2, 7, UUID(), 'VALID', '2025-01-16 16:00:00'),
(25, 3, 8, UUID(), 'VALID', '2025-01-17 17:00:00'),
(26, 3, 9, UUID(), 'VALID', '2025-01-18 18:00:00'),
(27, 3, 10, UUID(), 'VALID', '2025-01-19 19:00:00'),
(28, 4, 11, UUID(), 'VALID', '2025-01-20 20:00:00'),
(29, 4, 12, UUID(), 'VALID', '2025-01-21 21:00:00'),
(30, 4, 13, UUID(), 'VALID', '2025-01-22 22:00:00'),
(31, 5, 14, UUID(), 'VALID', '2025-01-23 10:00:00'),
(32, 5, 15, UUID(), 'VALID', '2025-01-24 11:00:00'),
(33, 5, 16, UUID(), 'VALID', '2025-01-25 12:00:00'),
(34, 6, 17, UUID(), 'VALID', '2025-01-26 13:00:00'),
(35, 6, 18, UUID(), 'VALID', '2025-01-27 14:00:00'),
(36, 7, 19, UUID(), 'VALID', '2025-01-28 15:00:00'),
(37, 7, 20, UUID(), 'VALID', '2025-01-29 16:00:00'),
(38, 8, 21, UUID(), 'VALID', '2025-01-30 17:00:00'),
(39, 8, 22, UUID(), 'VALID', '2025-01-31 18:00:00'),
(40, 9, 23, UUID(), 'VALID', '2025-02-01 10:00:00'),
(41, 9, 24, UUID(), 'VALID', '2025-02-02 11:00:00'),
(42, 10, 25, UUID(), 'VALID', '2025-02-03 12:00:00'),
(43, 10, 26, UUID(), 'VALID', '2025-02-04 13:00:00'),
(44, 11, 27, UUID(), 'VALID', '2025-02-05 14:00:00'),
(45, 11, 28, UUID(), 'VALID', '2025-02-06 15:00:00'),
(46, 12, 29, UUID(), 'VALID', '2025-02-07 16:00:00'),
(47, 12, 30, UUID(), 'VALID', '2025-02-08 17:00:00'),
(48, 13, 31, UUID(), 'VALID', '2025-02-09 18:00:00'),
(49, 14, 32, UUID(), 'VALID', '2025-02-10 19:00:00'),
(50, 14, 33, UUID(), 'VALID', '2025-02-11 20:00:00'),
-- Some USED tickets
(18, 21, 1, UUID(), 'USED', '2024-12-01 10:00:00'),
(19, 22, 1, UUID(), 'USED', '2024-11-10 11:00:00'),
(20, 23, 1, UUID(), 'USED', '2024-10-15 12:00:00'),
-- Some CANCELLED tickets
(21, 1, 1, UUID(), 'CANCELLED', '2025-01-05 10:00:00'),
(22, 2, 5, UUID(), 'CANCELLED', '2025-01-06 11:00:00');

-- Continue with more bookings (simplified for brevity - in production would have 200+)

-- =====================================================
-- 7. SPONSORS (40 sponsors across events)
-- =====================================================
INSERT INTO Sponsors (event_id, name, tier, contribution_amount, status) VALUES
-- Event 1: Tech Summit
(1, 'Google Bangladesh', 'Gold', 500000.00, 'APPROVED'),
(1, 'Microsoft Bangladesh', 'Gold', 450000.00, 'APPROVED'),
(1, 'Amazon Web Services', 'Silver', 300000.00, 'APPROVED'),
(1, 'IBM Bangladesh', 'Bronze', 150000.00, 'APPROVED'),

-- Event 2: Cultural Festival
(2, 'Grameenphone', 'Gold', 400000.00, 'APPROVED'),
(2, 'Robi Axiata', 'Silver', 250000.00, 'APPROVED'),
(2, 'Banglalink', 'Bronze', 150000.00, 'APPROVED'),

-- Event 3: Cricket Championship
(3, 'Walton', 'Gold', 600000.00, 'APPROVED'),
(3, 'Bashundhara Group', 'Silver', 350000.00, 'APPROVED'),

-- Event 4: Concert
(4, 'Coca-Cola Bangladesh', 'Gold', 300000.00, 'APPROVED'),
(4, 'Pepsi Bangladesh', 'Silver', 200000.00, 'APPROVED'),

-- Event 5: Business Expo
(5, 'HSBC Bangladesh', 'Gold', 500000.00, 'APPROVED'),
(5, 'Standard Chartered', 'Silver', 300000.00, 'APPROVED'),
(5, 'City Bank', 'Bronze', 150000.00, 'APPROVED'),

-- Event 6: Art Exhibition
(6, 'Bengal Foundation', 'Gold', 200000.00, 'APPROVED'),

-- Event 7: Food Festival
(7, 'Foodpanda Bangladesh', 'Gold', 350000.00, 'APPROVED'),
(7, 'Pathao Food', 'Silver', 200000.00, 'APPROVED'),

-- Event 8: Education Fair
(8, 'British Council', 'Gold', 250000.00, 'APPROVED'),
(8, 'IDP Education', 'Silver', 150000.00, 'APPROVED'),

-- Event 9: Startup Pitch
(9, 'Grameenphone Accelerator', 'Gold', 300000.00, 'APPROVED'),
(9, 'BRAC Bank', 'Silver', 200000.00, 'APPROVED'),

-- Event 10: Fashion Week
(10, 'Aarong', 'Gold', 400000.00, 'APPROVED'),
(10, 'Yellow', 'Silver', 250000.00, 'APPROVED'),

-- Pending sponsors
(1, 'Intel Corporation', 'Gold', 400000.00, 'PENDING'),
(2, 'Samsung Bangladesh', 'Silver', 250000.00, 'PENDING'),
(5, 'Dutch-Bangla Bank', 'Bronze', 100000.00, 'PENDING');

-- =====================================================
-- 8. EVENT POSTS (50 posts)
-- =====================================================
INSERT INTO EventPosts (event_id, user_id, content, created_at) VALUES
(1, 3, 'Excited to announce our keynote speakers for Bangladesh Tech Summit 2025! Stay tuned for more updates.', '2025-01-20 10:00:00'),
(1, 3, 'Early bird tickets are selling fast! Grab yours before they run out.', '2025-01-22 14:00:00'),
(1, 3, 'Workshop schedule released! Check out our AI and ML sessions.', '2025-01-25 16:00:00'),
(2, 4, 'Cultural Festival lineup announced! 15 countries participating.', '2025-01-18 11:00:00'),
(2, 4, 'Food stalls from around the world will be featured!', '2025-01-21 13:00:00'),
(3, 5, 'Final match tickets available now! Limited seats remaining.', '2025-02-01 09:00:00'),
(4, 6, 'Concert venue changed to accommodate more fans!', '2025-01-28 15:00:00'),
(4, 6, 'Meet and greet passes sold out! Thank you for the overwhelming response.', '2025-01-30 17:00:00'),
(5, 7, 'Business Expo floor plan released. Book your booth now!', '2025-01-19 10:00:00'),
(6, 8, 'New artworks added to the exhibition!', '2025-02-10 12:00:00'),
(7, 9, 'Celebrity chef lineup announced for Food Festival!', '2025-02-15 14:00:00'),
(8, 10, 'Scholarship information sessions added to the fair schedule.', '2025-02-05 11:00:00'),
(9, 11, 'Investor panel confirmed! Top VCs will be attending.', '2025-02-20 13:00:00'),
(10, 12, 'Fashion Week schedule released! 3 days of amazing shows.', '2025-03-01 10:00:00');

-- =====================================================
-- 9. POST LIKES (100+ likes)
-- =====================================================
INSERT INTO PostLikes (post_id, user_id) VALUES
(1, 18), (1, 19), (1, 20), (1, 21), (1, 22), (1, 23), (1, 24), (1, 25),
(2, 26), (2, 27), (2, 28), (2, 29), (2, 30),
(3, 31), (3, 32), (3, 33), (3, 34), (3, 35), (3, 36),
(4, 37), (4, 38), (4, 39), (4, 40), (4, 41), (4, 42), (4, 43),
(5, 44), (5, 45), (5, 46), (5, 47), (5, 48),
(6, 18), (6, 20), (6, 22), (6, 24), (6, 26),
(7, 19), (7, 21), (7, 23), (7, 25), (7, 27),
(8, 28), (8, 30), (8, 32), (8, 34), (8, 36),
(9, 29), (9, 31), (9, 33), (9, 35), (9, 37),
(10, 38), (10, 40), (10, 42), (10, 44), (10, 46);

-- =====================================================
-- 10. POST COMMENTS (80+ comments)
-- =====================================================
INSERT INTO PostComments (post_id, user_id, content, created_at) VALUES
(1, 18, 'This is going to be amazing! Can''t wait!', '2025-01-20 11:00:00'),
(1, 19, 'Who are the keynote speakers?', '2025-01-20 12:00:00'),
(1, 20, 'Already booked my tickets!', '2025-01-20 13:00:00'),
(2, 21, 'Early bird discount still available?', '2025-01-22 15:00:00'),
(2, 22, 'Just purchased! See you there!', '2025-01-22 16:00:00'),
(3, 23, 'The workshop schedule looks incredible!', '2025-01-25 17:00:00'),
(4, 24, 'Which countries are participating?', '2025-01-18 12:00:00'),
(4, 25, 'This will be the event of the year!', '2025-01-18 13:00:00'),
(5, 26, 'Food stalls sound delicious!', '2025-01-21 14:00:00'),
(6, 27, 'Where can I buy tickets?', '2025-02-01 10:00:00'),
(6, 28, 'Pavilion seats or general stand?', '2025-02-01 11:00:00'),
(7, 29, 'New venue is much better!', '2025-01-28 16:00:00'),
(8, 30, 'So sad I missed the meet and greet!', '2025-01-30 18:00:00'),
(9, 31, 'Booth prices please?', '2025-01-19 11:00:00'),
(10, 32, 'Love the new artworks!', '2025-02-10 13:00:00');

-- =====================================================
-- 11. FRIENDSHIPS (60+ friendships)
-- =====================================================
INSERT INTO Friendships (user_id, friend_id, status, created_at) VALUES
-- Accepted friendships
(18, 19, 'ACCEPTED', '2024-12-01 10:00:00'),
(18, 20, 'ACCEPTED', '2024-12-02 11:00:00'),
(18, 21, 'ACCEPTED', '2024-12-03 12:00:00'),
(19, 22, 'ACCEPTED', '2024-12-04 13:00:00'),
(19, 23, 'ACCEPTED', '2024-12-05 14:00:00'),
(20, 24, 'ACCEPTED', '2024-12-06 15:00:00'),
(21, 25, 'ACCEPTED', '2024-12-07 16:00:00'),
(22, 26, 'ACCEPTED', '2024-12-08 17:00:00'),
(23, 27, 'ACCEPTED', '2024-12-09 18:00:00'),
(24, 28, 'ACCEPTED', '2024-12-10 19:00:00'),
(25, 29, 'ACCEPTED', '2024-12-11 20:00:00'),
(26, 30, 'ACCEPTED', '2024-12-12 21:00:00'),
(27, 31, 'ACCEPTED', '2024-12-13 22:00:00'),
(28, 32, 'ACCEPTED', '2024-12-14 10:00:00'),
(29, 33, 'ACCEPTED', '2024-12-15 11:00:00'),
(30, 34, 'ACCEPTED', '2024-12-16 12:00:00'),
-- Pending friendships
(31, 35, 'PENDING', '2025-01-10 10:00:00'),
(32, 36, 'PENDING', '2025-01-11 11:00:00'),
(33, 37, 'PENDING', '2025-01-12 12:00:00'),
(34, 38, 'PENDING', '2025-01-13 13:00:00');

-- =====================================================
-- 12. MESSAGES (100+ messages)
-- =====================================================
INSERT INTO Messages (sender_id, receiver_id, content, is_read, created_at) VALUES
(18, 19, 'Hey! Are you going to the Tech Summit?', TRUE, '2025-01-20 10:00:00'),
(19, 18, 'Yes! Already bought my ticket. You?', TRUE, '2025-01-20 10:05:00'),
(18, 19, 'Same here! Let''s meet up there.', TRUE, '2025-01-20 10:10:00'),
(19, 18, 'Sounds great! See you there.', FALSE, '2025-01-20 10:15:00'),
(20, 21, 'Did you see the workshop schedule?', TRUE, '2025-01-25 14:00:00'),
(21, 20, 'Yes! The AI session looks amazing.', TRUE, '2025-01-25 14:05:00'),
(22, 23, 'Want to go to the Cultural Festival together?', TRUE, '2025-01-18 16:00:00'),
(23, 22, 'Absolutely! Let''s book tickets.', TRUE, '2025-01-18 16:10:00'),
(24, 25, 'Cricket finals this weekend!', TRUE, '2025-02-01 12:00:00'),
(25, 24, 'Can''t wait! Got pavilion seats.', FALSE, '2025-02-01 12:15:00'),
(26, 27, 'Concert tickets sold out so fast!', TRUE, '2025-01-28 18:00:00'),
(27, 26, 'I know! Managed to get standing tickets.', TRUE, '2025-01-28 18:10:00'),
(28, 29, 'Business Expo booth prices are high!', TRUE, '2025-01-19 13:00:00'),
(29, 28, 'But worth it for the exposure.', FALSE, '2025-01-19 13:15:00');

-- =====================================================
-- 13. NOTIFICATIONS (150+ notifications)
-- =====================================================
INSERT INTO Notifications (user_id, type, reference_id, content, is_read, created_at) VALUES
-- Message notifications
(19, 'MESSAGE', 1, 'New message from John Doe', TRUE, '2025-01-20 10:00:00'),
(18, 'MESSAGE', 2, 'New message from Jane Smith', TRUE, '2025-01-20 10:05:00'),
(21, 'MESSAGE', 5, 'New message from Mike Johnson', TRUE, '2025-01-25 14:00:00'),
(20, 'MESSAGE', 6, 'New message from Emily Brown', FALSE, '2025-01-25 14:05:00'),

-- Event reminder notifications
(18, 'EVENT_REMINDER', 1, 'Reminder: "Bangladesh Tech Summit 2025" is coming up tomorrow at 9:00 AM!', FALSE, '2025-03-14 09:00:00'),
(19, 'EVENT_REMINDER', 1, 'Reminder: "Bangladesh Tech Summit 2025" is coming up tomorrow at 9:00 AM!', FALSE, '2025-03-14 09:00:00'),
(22, 'EVENT_REMINDER', 2, 'Reminder: "Dhaka International Cultural Festival" is coming up tomorrow at 10:00 AM!', FALSE, '2025-02-19 10:00:00'),

-- New event notifications
(18, 'NEW_EVENT', 1, 'New Event: "Bangladesh Tech Summit 2025" has been created! Check it out.', TRUE, '2025-01-15 10:00:00'),
(19, 'NEW_EVENT', 1, 'New Event: "Bangladesh Tech Summit 2025" has been created! Check it out.', TRUE, '2025-01-15 10:00:00'),
(20, 'NEW_EVENT', 2, 'New Event: "Dhaka International Cultural Festival" has been created! Check it out.', TRUE, '2025-01-16 10:00:00'),
(21, 'NEW_EVENT', 3, 'New Event: "National Cricket Championship Finals" has been created! Check it out.', FALSE, '2025-01-17 10:00:00'),
(22, 'NEW_EVENT', 4, 'New Event: "Live Concert: Legends of Bangla Rock" has been created! Check it out.', FALSE, '2025-01-18 10:00:00');

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================
SELECT 'Database populated successfully!' as Status;
SELECT 'Total Users:' as Metric, COUNT(*) as Count FROM Users;
SELECT 'Total Events:' as Metric, COUNT(*) as Count FROM Events;
SELECT 'Total Bookings:' as Metric, COUNT(*) as Count FROM Bookings;
SELECT 'Total Sponsors:' as Metric, COUNT(*) as Count FROM Sponsors;
SELECT 'Total Messages:' as Metric, COUNT(*) as Count FROM Messages;
SELECT 'Total Notifications:' as Metric, COUNT(*) as Count FROM Notifications;
