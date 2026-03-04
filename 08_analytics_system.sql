-- =====================================================
-- Tier 6: Analytics & Reporting
-- File: 08_analytics_system.sql
-- =====================================================
-- 33. EventAnalytics
CREATE TABLE EventAnalytics (
    analytics_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    total_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    click_through_rate DECIMAL(5, 2),
    conversion_rate DECIMAL(5, 2),
    average_time_on_page INT,
    -- seconds
    source_breakdown JSON,
    -- traffic sources
    device_breakdown JSON,
    -- mobile/desktop/tablet
    geographic_breakdown JSON,
    -- country/city breakdown
    captured_date DATE NOT NULL,
    UNIQUE KEY unique_event_date (event_id, captured_date),
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 34. UserAnalytics
CREATE TABLE UserAnalytics (
    user_analytics_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    events_attended INT DEFAULT 0,
    events_created INT DEFAULT 0,
    total_bookings INT DEFAULT 0,
    total_spending DECIMAL(12, 2) DEFAULT 0,
    total_referrals INT DEFAULT 0,
    engagement_score INT DEFAULT 0,
    -- calculated metric
    last_activity_date TIMESTAMP NULL,
    last_login_date TIMESTAMP NULL,
    account_age_days INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user (user_id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 35. DailyMetrics
CREATE TABLE DailyMetrics (
    metric_id INT PRIMARY KEY AUTO_INCREMENT,
    metric_date DATE NOT NULL UNIQUE,
    new_users INT DEFAULT 0,
    new_events INT DEFAULT 0,
    total_bookings INT DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    active_users INT DEFAULT 0,
    event_attendance_rate DECIMAL(5, 2),
    platform_health_score INT,
    -- 0-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;