# Renting App — System Architecture

## 1. High-Level Architecture Diagram

```
                ┌───────────────────────────────┐
                │   Customer & Provider App     │
                │     (React / Vite Mobile)     │
                │        Port: 8081             │
                └───────────────┬───────────────┘
                                │
                                │ REST JSON APIs + JWT Auth
                                ▼
                ┌───────────────────────────────┐
                │        NestJS Backend         │
                │   Modular Controller Layer    │
                │        Port: 4000             │
                └───────┬───────────────┬───────┘
                        │               │
        ┌───────────────┴────┐          │ REST Admin APIs
        ▼                    ▼          ▼
┌───────────────┐   ┌────────────────┐  ┌─────────────────────────┐
│ Prisma ORM    │   │ Razorpay       │  │ Next.js Admin Dashboard │
│ SQLite / PG   │   │ Sandbox Client │  │       Port: 3000        │
└───────────────┘   └────────────────┘  └─────────────────────────┘
```

---

## 2. Backend Modular Structure

```
backend/src/
├── admin/                 # Admin operations (KYC approval, vehicle listing moderation, dispute resolution)
├── agreements/            # Digital rental agreement generation & digital signing hash
├── auth/                  # Phone OTP login, mock OTP, JWT generation & RBAC guards
├── bookings/              # Availability checking, double-booking prevention, price calculator
├── condition-reports/     # Pre-rental and post-rental inspection reports (odometer, fuel, photos)
├── disputes/              # Dispute filing, evidence review, claim settlement
├── locations/             # City & area taxonomy (Chandigarh, Sector 17, Sector 35, IT Park)
├── notifications/         # In-app notifications
├── payments/              # Payment abstraction & Razorpay test sandbox checkout
├── prisma/                # Prisma ORM client & service injection
├── providers/             # Rental agency & individual owner profiles, fleet metrics
├── reviews/               # Two-tier review system (Vehicle rating vs Provider rating)
├── users/                 # Customer profiles & reusable Driving License verification
└── vehicles/              # Fleet management, multi-provider search, filter engine, best value scoring
```

---

## 3. Core Business Logic Highlights

### A. Server-Side Double-Booking Prevention
Every booking request queries the database for active overlapping bookings (`CONFIRMED` or `ACTIVE`) in the requested date range:
```sql
SELECT id FROM Booking 
WHERE vehicleId = :vehicleId 
  AND status IN ('CONFIRMED', 'ACTIVE')
  AND NOT (endDate <= :requestedStart OR startDate >= :requestedEnd)
```

### B. Transparent Price Calculation Breakdown
- **Rental Amount**: `pricePerDay * totalDays` (or hourly if `< 24 hrs`)
- **Refundable Security Deposit**: Clearly isolated in financial ledger
- **Platform Convenience Fee**: Flat ₹100
- **Total Payable**: Sum of rental, deposit, and platform fees

### C. Reusable One-Time KYC Verification
Once an admin verifies a customer's Driving License, the `verificationStatus` is updated to `VERIFIED`. All subsequent bookings skip document submission.

### D. Digital Rental Agreement & Condition Proofs
- Each booking automatically synthesizes a digital contract detailing fuel policy (`SAME_TO_SAME`), daily mileage limit (150 km/day), damage terms, and deposit terms.
- Condition reports record odometer, fuel %, and photo links at vehicle pickup and return.
