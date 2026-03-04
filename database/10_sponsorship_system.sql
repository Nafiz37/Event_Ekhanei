-- =====================================================
-- Tier 8: Sponsorship System
-- File: 10_sponsorship_system.sql
-- =====================================================
-- 38. SponsorshipPackages
CREATE TABLE SponsorshipPackages (
    package_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    benefits TEXT,
    max_slots INT,
    slots_taken INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 39. EventSponsorships (Extended)
CREATE TABLE EventSponsorships (
    sponsorship_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    sponsor_id INT NOT NULL,
    package_id INT,
    amount_paid DECIMAL(15, 2),
    payment_status ENUM('Pending', 'Completed', 'Partial') DEFAULT 'Pending',
    contract_url VARCHAR(500),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    display_priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (sponsor_id) REFERENCES Sponsors(sponsor_id),
    FOREIGN KEY (package_id) REFERENCES SponsorshipPackages(package_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Index for performance
CREATE INDEX idx_sponsorship_event ON EventSponsorships(event_id);