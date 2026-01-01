# Modemen Magazine - Platform Overview

## **Executive Summary**
**Modemen Magazine** is a hybrid digital platform that seamlessly blends a high-end lifestyle magazine with a robust e-commerce store. It is designed to serve two primary audiences:
1.  **Readers**: Who consume premium articles, interviews, and digital issues.
2.  **Shoppers**: Who purchase curated fashion, grooming products, and event tickets.

For the business owners, it provides a centralized **"Command Center" (CMS)** to manage all content, sales, and user data without needing technical expertise.

---

## **Part 1: Business & User Features**
*(Designed for Stakeholders, Editors, and Marketing Teams)*

### **1. The Digital Experience (For Readers)**
*   **Premium Content Hub**: A beautiful interface for reading articles categorized by interests like *Style*, *Culture*, and *Business*.
*   **Video Interviews**: A dedicated section for immersive video interviews with industry leaders and celebrities.
*   **Digital Newsstand**: Users can browse and purchase back issues of the magazine digitally.
*   **Events Calendar**: A centralized place to discover upcoming events, get details, and purchase tickets directly.
*   **Membership Tiers**:
    *   **Free**: Access to standard content.
    *   **Premium/VIP**: special access to exclusive "Locked" articles and content.

### **2. The Online Shop (For Customers)**
*   **Full Online Store**: A complete shopping experience integrated directly into the magazine.
*   **Seamless Checkout**: Customers can add items to a cart and pay securely using their ATM cards or bank transfers (via Paystack).
*   **Order Tracking**: Customers can log in to view their order history and track shipping status (e.g., from "Pending" to "Delivered").
*   **Discounts & Coupons**: The system supports promotional codes for seasonal sales or marketing campaigns.

### **3. Operational Control (For Admins/Editors)**
*   **Command Center Dashboard**: A private admin area (`/cms`) that gives a snapshot of the business:
    *   Total Sales & Orders
    *   Active Subscribers
    *   Best-selling Products
*   **Content Management**: Editors can write and publish articles, upload new magazine issues, and list events without writing code.
*   **Shop Management**:
    *   **Product Catalog**: Add new products, update prices, and manage stock levels.
    *   **Order Fulfillment**: View incoming orders and update their status (e.g., mark as "Shipped").
*   **Advertising Platform**: Manage sponsored content and banner ads for partners directly through the system.

### **4. User Engagement Tools**
*   **Personalized Accounts**: Users have their own dashboard to manage addresses, saved articles, and wishlists.
*   **Newsletters**: Built-in forms to collect email subscribers for marketing campaigns.
*   **Security**: Secure login and password protection for all user data.

---

## **Part 2: Technical Architecture**
*(Designed for Developers and Technical Teams)*

### **Core Stack**
*   **Frontend**: [Next.js 16](https://nextjs.org/) (App Router) – Ensures fast loading, SEO optimization, and modern routing.
*   **Backend**: Server Actions – Handles business logic (payments, auth) securely on the server without a separate backend API.
*   **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) – Reliable, type-safe data storage.
*   **Payment Gateway**: [Paystack](https://paystack.com/) – Handles African payment methods securely.

### **Key Technical Implementations**
*   **Authentication**: Custom HTTP-only cookie session system using `bcrypt` for security. Includes Role-Based Access Control (RBAC) to protect Admin routes.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom design system (Gold/Black theme) and [Shadcn UI](https://ui.shadcn.com/) for accessible components.
*   **Analytics**: Integrated Google Analytics 4 for tracking user behavior.
*   **Performance**:
    *   **Server-Side Rendering (SSR)**: Pages are pre-rendered for speed and Google ranking.
    *   **Optimized Assets**: Images and fonts (`Inria Serif`) are optimized automatically by Next.js.
