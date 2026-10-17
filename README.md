# Rental

> **City Vehicle Rental Marketplace**: Unifying vehicle rental discovery, side-by-side agency comparison, one-time reusable customer verification, transparent deposit pricing, and digital rental agreements.

---

## 🚀 Overview & Problem Solved

Traditional vehicle rentals in Indian cities suffer from severe information fragmentation across WhatsApp groups, Google Maps listings, social media posts, and phone calls. Customers spend hours contacting individual agencies to check rates, confirm security deposits, and negotiate terms.

**Renting App** aggregates:
1. **Professional Rental Agencies** (fleets of bikes and scooters)
2. **Individual Vehicle Owners** (peer-to-peer verified rentals)

into a single comparison platform with:
- **City-Specific Multi-Provider Search** (Demo City: **Chandigarh**)
- **Side-by-Side Rate & Deposit Matrix**
- **One-Time Reusable KYC** (Indian Driving License verification)
- **Transparent Price Breakdown** (Separating Daily Rent from 100% Refundable Security Deposit & Platform Fee)
- **Server-Side Double Booking Prevention**
- **Digital Rental Agreements** (with cryptographic signature hashes)
- **Pre & Post Rental Condition Proofs** (Odometer readings, fuel %, and photo records)
- **Two-Tier Reviews** (Separate star ratings for Vehicle condition vs Provider service)
- **Dispute Resolution Portal**
- **Partner & Provider Portal**
- **Next.js Admin Operations Dashboard**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Mobile Web App** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons |
| **Admin Dashboard** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons |
| **Backend REST API** | NestJS, TypeScript, Passport JWT, Jest |
| **Database & ORM** | SQLite / PostgreSQL with Prisma ORM |
| **Payment Gateway** | Razorpay Sandbox Abstraction Layer |

---

## 👥 User Roles & Flow

```
+-----------------------------------------------------------------------------------+
| 1. Customer: Discover -> Compare -> 1-Time KYC -> Book -> Pay -> Return -> Review |
| 2. Provider: Register -> Submit Docs -> List Fleet -> Manage Bookings -> Handover  |
| 3. Admin: Verify KYC -> Approve Fleet -> Audit Bookings -> Resolve Disputes       |
+-----------------------------------------------------------------------------------+
```

---

## 🏃 Quick Start (Local Development)

### 1. Start Backend API (Port 4000)
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run start:dev
```

### 2. Start Customer / Mobile App (Port 8081)
```bash
cd mobile
npm install
npm run dev
```

### 3. Start Next.js Admin Dashboard (Port 3000)
```bash
cd admin
npm install
npm run dev
```

---

## 🎯 Master Demo Scenario (Chandigarh)

1. Open **Customer App** (`http://localhost:8081`).
2. Search **"Bullet"** in **Chandigarh**.
3. View multiple options side-by-side (e.g. *CityRiders Hub* vs *Sector 35 Wheels* vs *Rajesh Sharma*).
4. Select 2-3 vehicles and click **"Compare"** to view the matrix.
5. Select a 2-day booking period; verify transparent price breakdown (Rent: ₹1,500, Deposit: ₹1,500, Fee: ₹100 = Total ₹3,100).
6. Complete instant sandbox payment and inspect generated **Digital Rental Agreement**.
7. View and moderate the booking in the **Admin Dashboard** (`http://localhost:3000/bookings`).
