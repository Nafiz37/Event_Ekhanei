-- =====================================================
-- Tier 5: Admin & Moderation
-- File: 07_admin_moderation.sql
-- =====================================================
-- 31. AdminRoles (Moved up as it is a dependency for AdminUsers)
CREATE TABLE AdminRoles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    -- array of permission strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 32. AdminUsers
CREATE TABLE AdminUsers (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    role_id INT NOT NULL,
    department VARCHAR(100),
    permissions JSON,
    -- override permissions
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    last_login TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (role_id) REFERENCES AdminRoles(role_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 27. AdminAuditLog
CREATE TABLE AdminAuditLog (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id INT NOT NULL,
    action_type VARCHAR(100),
    entity_type VARCHAR(100),
    -- 'User', 'Event', 'Booking', etc.
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    status ENUM('Success', 'Failure') DEFAULT 'Success',
    FOREIGN KEY (admin_user_id) REFERENCES Users(id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_admin_id (admin_user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 28. ReportedContent
CREATE TABLE ReportedContent (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    reported_by_user_id INT NOT NULL,
    content_type ENUM('Post', 'Comment', 'Event', 'User', 'Message') NOT NULL,
    content_id INT NOT NULL,
    reason VARCHAR(255),
    description TEXT,
    status ENUM(
        'New',
        'In Review',
        'Resolved',
        'Dismissed',
        'Action Taken'
    ) DEFAULT 'New',
    assigned_to_admin INT,
    resolution_notes TEXT,
    action_taken ENUM(
        'Warning',
        'Content Removed',
        'User Suspended',
        'User Banned',
        'Event Cancelled'
    ) NULL,
    reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP NULL,
    FOREIGN KEY (reported_by_user_id) REFERENCES Users(id),
    FOREIGN KEY (assigned_to_admin) REFERENCES Users(id),
    INDEX idx_status (status),
    INDEX idx_reported_date (reported_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 29. UserModeration
CREATE TABLE UserModeration (
    moderation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    warning_level INT DEFAULT 0,
    -- 0-3
    is_suspended BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    suspension_reason VARCHAR(255),
    ban_reason VARCHAR(255),
    suspended_by_admin INT,
    banned_by_admin INT,
    suspension_start TIMESTAMP NULL,
    suspension_end TIMESTAMP NULL,
    ban_date TIMESTAMP NULL,
    appeals_count INT DEFAULT 0,
    last_warning_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (suspended_by_admin) REFERENCES Users(id),
    FOREIGN KEY (banned_by_admin) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 30. SystemLogs
CREATE TABLE SystemLogs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    log_type ENUM('Error', 'Warning', 'Info', 'Debug', 'Security') DEFAULT 'Info',
    message TEXT NOT NULL,
    error_code VARCHAR(50),
    stack_trace TEXT,
    user_id INT,
    endpoint VARCHAR(500),
    method VARCHAR(10),
    status_code INT,
    response_time_ms INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    INDEX idx_log_type (log_type),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;