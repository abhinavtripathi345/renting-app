# Renting App — Local Setup & Execution Guide

Follow these steps to run the complete full-stack Renting App MVP on your local machine.

---

## 📋 Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## 🛠️ Step 1: Database Setup & Seeding

Navigate to the `backend/` directory:
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
```

This creates the SQLite database (`backend/prisma/dev.db`) and seeds it with:
- Default City: **Chandigarh** with 4 areas (Sector 17, Sector 35, IT Park, Sector 22)
- **3 Rental Agencies** & **2 Individual Vehicle Owners**
- **10+ Verified Bikes & Scooters** (Royal Enfield Bullet 350, Himalayan 411, Hunter 350, Honda Activa 6G, TVS Jupiter, etc.) with realistic daily rates, security deposits, ratings, and location coords
- Demo customer accounts (Verified Aarav, KYC-Pending Pooja)
- Admin account (`admin@rentingapp.in`)

---

## 🚀 Step 2: Launch the Backend Service

In the `backend/` terminal:
```bash
npm run start:dev
```
The NestJS REST API server will run at:
👉 `http://localhost:4000/api`

---

## 📱 Step 3: Launch the Customer & Provider App

In a second terminal:
```bash
cd mobile
npm install
npm run dev
```
The responsive Customer / Mobile Web App will run at:
👉 `http://localhost:8081`

---

## 💻 Step 4: Launch the Next.js Admin Dashboard

In a third terminal:
```bash
cd admin
npm install
npm run dev
```
The Admin Operations Dashboard will run at:
👉 `http://localhost:3000`

---

## 🧪 Step 5: Running Automated Tests

Run backend Jest test suites:
```bash
cd backend
npm test
```
This tests:
- Pricing calculation & transparent breakdown
- Overlap detection & double-booking prevention
- Review authorization (only completed bookings)
- Role-based security guards
