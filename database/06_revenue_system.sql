-- =====================================================
-- Tier 4: Revenue & Finance
-- File: 06_revenue_system.sql
-- =====================================================
-- 23. Payments
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BDT',
    payment_method ENUM(
        'Credit Card',
        'Debit Card',
        'Mobile Wallet',
        'Bank Transfer',
        'Cash'
    ) NOT NULL,
    payment_status ENUM(
        'Pending',
        'Completed',
        'Failed',
        'Refunded',
        'Partially Refunded'
    ) DEFAULT 'Pending',
    transaction_id VARCHAR(255) UNIQUE,
    payment_gateway VARCHAR(100),
    -- Stripe, PayPal, bKash, etc.
    paid_at TIMESTAMP NULL,
    receipt_url VARCHAR(500),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    INDEX idx_payment_status (payment_status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 24. EventRevenue
CREATE TABLE EventRevenue (
    revenue_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    total_ticket_revenue DECIMAL(12, 2) DEFAULT 0,
    sponsorship_revenue DECIMAL(12, 2) DEFAULT 0,
    service_fees DECIMAL(12, 2) DEFAULT 0,
    refunds DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'BDT',
    report_date DATE NOT NULL,
    breakdown JSON,
    -- detailed breakdown by ticket type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event_date (event_id, report_date),
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 25. Refunds
CREATE TABLE Refunds (
    refund_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Processed', 'Rejected') DEFAULT 'Pending',
    requested_by INT,
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (requested_by) REFERENCES Users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 26. PlatformFees
CREATE TABLE PlatformFees (
    fee_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    percentage_fee DECIMAL(5, 2) DEFAULT 3.50,
    fixed_fee DECIMAL(10, 2) DEFAULT 0.50,
    total_fees DECIMAL(12, 2),
    payment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (payment_id) REFERENCES Payments(payment_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;