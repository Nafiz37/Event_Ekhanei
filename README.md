# 🐟 Event Koi - Complete Event Management System

![Event Koi Banner](public/images/hero-dashboard.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer--Motion-12.0-ff0055?logo=framer)](https://www.framer.com/motion/)

> **Event Koi** is a high-performance, aesthetically stunning event management ecosystem designed for the modern era. Built on a robust relational foundation, it seamlessly bridges the gap between organizers, attendees, and sponsors through real-time interactions, deep analytics, and professional-grade orchestration.

---

## 🌟 Premium Features

### 🏢 **Command Center (Admin)**
*   **Real-time Analytics Dashboard:** Visualize platform health with live metrics on user growth, ticket sales, and event distribution.
*   **Automated Moderation Queue:** Advanced system for flagging and reviewing content, with direct audit logs.
*   **Role Request Management:** Secure workflow for upgrading users from Attendee to Organizer with document validation.
*   **Financial Oversight:** Comprehensive revenue tracking, platform fee management, and distribution reporting.
*   **Data Archiving System:** Built-in SQL procedures to move historical data while maintaining platform speed.

### 🎭 **Exhibition Hub (Organizer)**
*   **Advanced Event Orchestration:** Multi-track scheduling, ticketing tiers, and inventory control.
*   **Sponsorship Ecosystem:** Integrated system for managing multi-level sponsorships (Gold, Silver, Bronze) with approval workflows.
*   **Attendee Engagement:** Live chat for post-event updates, friend systems, and broadcast notifications.
*   **Revenue Management:** Individual event financial dashboards showing net income after platform fees.
*   **Waitlist System:** Automatically manage high-demand events with a robust queueing mechanism.

### 🎟️ **Attendee Experience**
*   **Social Networking:** Discover friends, follow organizers, and engage via real-time messaging.
*   **Smart Ticketing:** QR-code powered tickets with instant validation via the integrated mobile scanner.
*   **Dynamic Discovery:** Search events by category, date, or organizer with intelligent filtering.
*   **Refund Policy Engine:** Automated SQL triggers handle refund eligibility based on event proximity.

---

## 🏗️ Technical Architecture

### **Core Stack**
- **Frontend Engine:** Next.js 15 (App Router) with Server & Client Component optimization.
- **Styling Design System:** Custom Tailwalled CSS with glassmorphism, ambient glows, and responsive grids.
- **Animation Suite:** Framer Motion for high-fidelity transitions and micro-interactions.
- **Data Persistence:** MySQL 8.0 (Optimized for TiDB Cloud) via `mysql2` for raw SQL performance.
- **Image Processing:** Cloudinary integration for lightning-fast, edge-delivered visual assets.

### **RDBMS Powerhouse**
The system logic is deeply embedded in the database layer for maximum integrity and performance:
- **13+ Relational Tables:** Fully normalized (3NF) architecture.
- **Automated Triggers:** Handles ticket status updates, refund calculations, and notification broadcasting.
- **Stored Procedures:** Manages complex workflows like "Database Reset," "Role Upgrades," and "Platform-wide Reporting."
- **Optimized Views:** Pre-aggregated data for high-speed admin dashboards and financial summaries.

---

## 📂 Project Structure

```bash
event-koi/
├── database/            # SQL Architecture (Schema, Seed, Procedures)
│   ├── 01_schema.sql    # Core Table Structure
│   ├── 02_procedures.sql # Automated Logic & Triggers
│   ├── 06_revenue.sql   # Financial Reporting System
│   └── 08_analytics.sql # Data Aggregation Views
├── src/
│   ├── app/
│   │   ├── api/         # High-performance Next.js API Routes
│   │   ├── dashboard/   # Unified User/Admin Interface
│   │   └── login/       # Elegant Authentication Flows
│   ├── components/      # Atomic UI Components & Dashboards
│   └── lib/             # Shared Utilities & DB Connection Pool
└── public/              # Global Assets & ER Diagrams
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** 18.x or higher
- **MySQL** 8.0 or a **TiDB Cloud** instance
- **npm** or **pnpm**

### **Installation**

1.  **Clone the Vision**
    ```bash
    git clone https://github.com/IsTu25/Event-Koi.git
    cd Event-Koi
    ```

2.  **Harmonize Dependencies**
    ```bash
    npm install
    ```

3.  **Configure the Environment**
    Create a `.env.local` file with your credentials:
    ```env
    DB_HOST=your_host
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_NAME=event_koi
    DB_PORT=4000
    DB_SSL=true

    CLOUDINARY_CLOUD_NAME=your_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```

4.  **Ignite the Database**
    ```bash
    node scripts/reset-database.js
    ```

5.  **Enter the Dashboard**
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`

---

## 🎨 Design Showcase

| **Analytics Hub** | **Financial Oversight** |
| :---: | :---: |
| ![Analytics](public/images/hero-dashboard.png) | ![Finance](public/images/hero-dashboard.png) |

> *Note: Visit the [Admin Guide](./ADMIN_GUIDE.md) for deeper insights into the Moderation and Revenue systems.*

---

## 🛡️ Security & Integrity
- **Password Protection:** Industry-standard `bcryptjs` hashing.
- **Access Control:** Granular Role-Based Access Control (RBAC) enforced at both API and Database levels.
- **Data Safety:** Transactional SQL operations ensure atomicity during ticket bookings and payment processing.

---

## 🤝 Community
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Built with ❤️ for Event Organizers everywhere.*
