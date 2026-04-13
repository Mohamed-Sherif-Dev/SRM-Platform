# SupplyChain Pro 🏭

> Modern Supplier Relationship Management Platform

A fully-featured, production-ready SRM platform built with Next.js 15. Manage suppliers, purchase orders, contracts, payments, and analytics — all in one place with a stunning dark orange-and-black UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer)
![Recharts](https://img.shields.io/badge/Recharts-Charts-FF6384?style=for-the-badge)

-----

## ✨ Features

### 🏭 Supplier Management

- Full supplier database with CRUD operations
- Supplier categories (Technology, Goods, Services, Logistics, Raw Materials)
- Status tracking (Active, Inactive, Blacklisted, Pending)
- Preferred supplier marking with award badge
- Contact person management
- Performance metrics (On-time delivery, Quality score)
- Tags and notes system
- Detail side panel with full supplier info

### 📋 Purchase Orders

- Complete purchase order lifecycle management
- Status workflow: Draft → Pending → Approved → Ordered → Received
- Priority levels (Low, Medium, High, Urgent)
- Line items with quantities and pricing
- Real-time status updates from detail panel
- Filter by status with counters
- Total value tracking

### 📄 Contracts & Agreements

- Contract lifecycle management (Draft → Active → Expired)
- Expiry alerts with days remaining indicator
- Auto-renewal configuration
- Contract value and payment terms
- Visual timeline (Start → End date)
- Expiring soon warnings (within 90 days)
- Expired contract detection

### 💰 Payment Tracking

- Payment status management (Pending, Processing, Paid, Overdue, Failed)
- Multiple payment methods (Bank Transfer, Credit Card, Cash, Check, Online)
- Invoice number linking
- Overdue payment alerts with total amount
- One-click “Mark as Paid” action
- Invoice download support
- Comprehensive payment history

### 📈 Analytics & Reports

- Annual KPIs (Total Spend, Orders, Avg Order Value, Savings Rate)
- Monthly spend area chart with period toggle (3M, 6M, 12M)
- Orders per month bar chart
- Spend by category donut chart
- Supplier performance radar chart
- Supplier performance comparison table with rankings

### ⭐ Supplier Ratings

- Multi-criteria rating system (Quality, Delivery, Communication, Pricing)
- Interactive star rating input
- Supplier leaderboard with medals
- Comments and feedback system
- Filter ratings by supplier
- Visual criteria breakdown

### 🔐 Authentication

- Email/Password login
- Google OAuth
- Protected routes
- Role-based access (Super Admin, Admin, Manager, Viewer)
- Session management via NextAuth.js

### 🎨 UI/UX

- Dark / Light mode toggle (persisted)
- Black + Orange design system
- Collapsible sidebar with tooltips
- Framer Motion animations throughout
- Fully responsive (mobile + tablet + desktop)
- Custom orange scrollbar
- Loading states and skeletons
- Toast notifications

-----

## 🛠 Tech Stack

|Layer        |Technology                           |
|-------------|-------------------------------------|
|Framework    |Next.js 15 (App Router + API Routes) |
|Language     |TypeScript                           |
|Database     |PostgreSQL (Neon.tech)               |
|ORM          |Prisma                               |
|Auth         |NextAuth.js v5 (Google + Credentials)|
|Styling      |Tailwind CSS v3                      |
|Animations   |Framer Motion                        |
|Charts       |Recharts                             |
|State        |Zustand                              |
|Data Fetching|TanStack React Query                 |
|Theme        |next-themes                          |
|Icons        |Lucide React                         |
|Notifications|react-hot-toast                      |
|Deploy       |Vercel                               |

-----

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/srm-platform.git
cd srm-platform
npm install
```

### 2. Setup environment variables

Create `.env.local`:

```env
# Database (Neon.tech)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Setup database

```bash
npx prisma db push
npx prisma generate
npm run seed
```

### 4. Run development server

```bash
npm run dev
```

Open <http://localhost:3000> 🎉

-----

## 👥 Demo Accounts

|Role         |Email          |Password  |
|-------------|---------------|----------|
|👑 Super Admin|admin@srm.com  |Admin@1234|
|👔 Manager    |manager@srm.com|Admin@1234|

-----

## 📡 API Routes

```
POST   /api/auth/register     Register new user
POST   /api/auth/[...nextauth] NextAuth handlers (Login, OAuth)
```

-----

## 🗄 Database Schema

```
User
├── id, name, email, password (hashed)
├── role (SUPER_ADMIN / ADMIN / MANAGER / VIEWER)
├── isActive, emailVerified
└── accounts, sessions

Supplier
├── id, name, code (unique), category, status
├── contact info (email, phone, website)
├── contact person details
├── performance metrics (avgRating, onTimeDelivery, qualityScore)
├── financial info (totalOrders, totalSpent, currency)
└── contacts, documents, orders, contracts, payments, ratings

PurchaseOrder
├── id, number (unique), supplierId, createdById
├── status (DRAFT → PENDING → APPROVED → ORDERED → RECEIVED)
├── priority (LOW / MEDIUM / HIGH / URGENT)
├── financial (subtotal, tax, shipping, discount, total)
└── items, payments, activityLogs

Contract
├── id, number (unique), supplierId, createdById
├── status (DRAFT / ACTIVE / EXPIRED / TERMINATED / RENEWED)
├── dates (startDate, endDate, renewalDate)
├── value, currency, paymentTerms
└── autoRenew, noticePeriod

Payment
├── id, reference (unique), supplierId, orderId
├── status (PENDING / PROCESSING / PAID / FAILED / OVERDUE)
├── method (BANK_TRANSFER / CREDIT_CARD / CASH / CHECK / ONLINE)
├── amount, currency, dueDate, paidAt
└── invoiceNumber, invoiceUrl

SupplierRating
├── supplierId, userId
├── overall, quality, delivery, communication, pricing
└── comment, orderId

ActivityLog
├── userId, supplierId, orderId, contractId, paymentId
├── action, description
└── metadata
```

-----

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/               # NextAuth + Register
│   ├── login/                  # Login page
│   ├── register/               # Register page
│   ├── dashboard/
│   │   ├── page.tsx            # Overview + KPIs
│   │   ├── suppliers/          # Supplier management
│   │   ├── orders/             # Purchase orders
│   │   ├── contracts/          # Contracts
│   │   ├── payments/           # Payment tracking
│   │   ├── analytics/          # Charts + reports
│   │   ├── ratings/            # Supplier ratings
│   │   └── settings/           # User settings
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Collapsible sidebar
│   │   ├── Topbar.tsx          # Top navigation
│   │   └── DashboardLayout.tsx # Layout wrapper
│   ├── ui/
│   │   └── StatCard.tsx        # KPI stat cards
│   └── Providers.tsx
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # NextAuth config
│   ├── response.ts             # API helpers
│   └── utils.ts                # Utilities
├── store/
│   └── uiStore.ts              # Sidebar state
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Demo data
```

-----

## 🔑 Pages

|Route                 |Description                       |
|----------------------|----------------------------------|
|`/`                   |Landing page                      |
|`/login`              |Sign in (Email + Google OAuth)    |
|`/register`           |Create account                    |
|`/dashboard`          |Overview — KPIs, charts, alerts   |
|`/dashboard/suppliers`|Supplier management + detail panel|
|`/dashboard/orders`   |Purchase orders + status workflow |
|`/dashboard/contracts`|Contracts + expiry tracking       |
|`/dashboard/payments` |Payments + overdue alerts         |
|`/dashboard/analytics`|Charts + performance reports      |
|`/dashboard/ratings`  |Supplier ratings + leaderboard    |
|`/dashboard/settings` |Profile, security, appearance     |

-----

## 🎨 Design System

```
Colors:
  Primary:    #f97316 (Orange 500)
  Dark BG:    #030712
  Dark Card:  #111827
  Dark Border:#1f2937
  Light BG:   #f9fafb
  Light Card: #ffffff

Typography:
  Font: Inter (300 → 800)

Animations:
  Sidebar:  Spring collapse/expand
  Cards:    Fade up on mount + hover lift
  Charts:   Animated area fill
  Modals:   Scale in/out
```

-----

## 🌱 Seed Data

The seed creates:

- 2 demo users (Admin + Manager)
- 5 suppliers across different categories
- 4 purchase orders with different statuses
- 3 contracts (2 active, 1 expired)
- 4 payments (paid, pending, overdue, processing)
- 3 supplier ratings with comments

-----

## 📝 License

MIT License

-----

## 👨‍💻 Author

Built by **Mohammed Sherif** — [GitHub](https://github.com/Mohamed-Sherif-Dev) · [LinkedIn](https://linkedin.com/in/mohammed-sherif-a57445363) · [Portfolio](https://portfolio-mohammed-nine.vercel.app)