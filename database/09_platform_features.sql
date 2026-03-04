-- =====================================================
-- Tier 7: Additional Features
-- File: 09_platform_features.sql
-- =====================================================
-- 36. SearchHistory
CREATE TABLE SearchHistory (
    search_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    search_query VARCHAR(500),
    search_type ENUM('Event', 'User', 'Venue', 'Category'),
    results_count INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    INDEX idx_user_searched (user_id, searched_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 37. UserRecommendations
CREATE TABLE UserRecommendations (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    recommendation_score DECIMAL(5, 2),
    reason VARCHAR(255),
    -- 'Trending', 'Friend Attending', 'Category Match'
    algorithm_version VARCHAR(50),
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    INDEX idx_user_recommendations (user_id, recommendation_score)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;