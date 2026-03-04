-- =====================================================
-- Tier 2: User & Profile Management
-- File: 04_user_profile_expansion.sql
-- =====================================================
-- 14. UserProfiles (Extended)
CREATE TABLE UserProfiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    bio TEXT,
    profile_image_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
    location VARCHAR(255),
    website_url VARCHAR(500),
    social_media_links JSON,
    badges JSON,
    -- achievement badges
    verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    primary_interest_category_id INT,
    secondary_interests JSON,
    -- array of category IDs
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (primary_interest_category_id) REFERENCES Categories(category_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 15. UserAchievements
CREATE TABLE UserAchievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_type VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    badge_icon_url VARCHAR(500),
    points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 16. UserPreferences
CREATE TABLE UserPreferences (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    event_reminders BOOLEAN DEFAULT TRUE,
    friend_requests BOOLEAN DEFAULT TRUE,
    privacy_mode ENUM('Public', 'Private', 'Friends') DEFAULT 'Public',
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    theme_preference VARCHAR(20),
    currency_preference VARCHAR(10) DEFAULT 'BDT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 17. UserFollowing
CREATE TABLE UserFollowing (
    following_id INT PRIMARY KEY AUTO_INCREMENT,
    follower_user_id INT NOT NULL,
    following_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow (follower_user_id, following_user_id),
    FOREIGN KEY (follower_user_id) REFERENCES Users(id),
    FOREIGN KEY (following_user_id) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Indexes for Tier 2
CREATE INDEX idx_user_id ON UserProfiles(user_id);