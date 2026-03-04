-- =====================================================
-- Tier 3: Event Management & Advanced
-- File: 05_event_advanced_features.sql
-- =====================================================
-- 18. EventCategories (Many-to-Many)
CREATE TABLE EventCategories (
    event_category_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    category_id INT NOT NULL,
    UNIQUE KEY unique_event_category (event_id, category_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 19. EventTags
CREATE TABLE EventTags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    INDEX idx_tag_name (tag_name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 20. EventSchedule (For multi-day/session events)
CREATE TABLE EventSchedule (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    session_name VARCHAR(255),
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(500),
    speaker_or_host_name VARCHAR(255),
    capacity INT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 21. EventWaitlist
CREATE TABLE EventWaitlist (
    waitlist_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    ticket_type_id INT,
    position_in_queue INT,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT FALSE,
    notified_date TIMESTAMP NULL,
    UNIQUE KEY unique_waitlist (event_id, user_id, ticket_type_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (ticket_type_id) REFERENCES TicketTypes(ticket_type_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 22. EventReviews
CREATE TABLE EventReviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (
        rating BETWEEN 1 AND 5
    ),
    title VARCHAR(255),
    content TEXT,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_review (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Indexes for Tier 3
CREATE INDEX idx_event_id ON EventWaitlist(event_id);