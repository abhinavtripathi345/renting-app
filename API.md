# Renting App — REST API Reference

Base URL: `http://localhost:4000/api`

---

## 1. Authentication (`/auth`)

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/auth/send-otp` | POST | Request 6-digit mock OTP for phone | No |
| `/auth/verify-otp` | POST | Verify OTP & receive JWT token | No |
| `/auth/dev-quick-login` | POST | 1-click dev role login (Customer/Agency/Owner/Admin) | No |
| `/auth/me` | GET | Retrieve authenticated profile | Yes (Bearer) |

---

## 2. Vehicles & Discovery (`/vehicles`)

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/vehicles` | GET | Search vehicles with filters (`city`, `category`, `query`, `minRating`, `maxPrice`, `sortBy`, `verifiedOnly`) | No |
| `/vehicles/:id` | GET | Get full vehicle specifications, pricing, and provider details | No |
| `/vehicles/compare?ids=id1,id2` | GET | Compare multiple vehicles side-by-side | No |
| `/vehicles` | POST | List new vehicle (Provider only) | Yes (PROVIDER) |

---

## 3. Bookings & Availability (`/bookings`)

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/bookings/calculate-price` | POST | Validate live availability & compute transparent price breakdown | No |
| `/bookings` | POST | Create confirmed booking with Razorpay sandbox payment | Yes (CUSTOMER) |
| `/bookings` | GET | List user/provider bookings | Yes |
| `/bookings/:id` | GET | Retrieve booking details | Yes |
| `/bookings/:id/status` | PATCH | Transition booking status (`ACTIVE`, `COMPLETED`, `CANCELLED`) | Yes |

---

## 4. One-Time Verification / KYC (`/users`)

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/users/verification-status` | GET | Check reusable KYC status | Yes |
| `/users/documents` | POST | Submit Indian Driving License details & document URLs | Yes |
| `/users/me` | PATCH | Update user profile | Yes |

---

## 5. Agreements & Condition Reports

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/agreements/booking/:bookingId` | GET | Get generated digital rental agreement | Yes |
| `/agreements/sign/:bookingId` | POST | Digitally sign agreement with audit hash | Yes |
| `/condition-reports/booking/:bookingId` | GET | Fetch pre- and post-rental inspection reports | Yes |
| `/condition-reports` | POST | Submit odometer reading, fuel %, and photo evidence | Yes |

---

## 6. Reviews & Disputes

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/reviews` | POST | Submit two-tier review (Vehicle + Provider) for completed booking | Yes |
| `/reviews/vehicle/:vehicleId` | GET | List verified reviews for a vehicle | No |
| `/disputes` | POST | File dispute against a booking with claim amount and evidence | Yes |
| `/disputes` | GET | List user disputes | Yes |

---

## 7. Admin Operations (`/admin`)

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/admin/stats` | GET | High-level platform metrics | Yes (ADMIN) |
| `/admin/verifications` | GET | List pending customer KYC submissions | Yes (ADMIN) |
| `/admin/verifications/:id` | PATCH | Approve or reject customer Driving License | Yes (ADMIN) |
| `/admin/providers` | GET | List registered agencies and vehicle owners | Yes (ADMIN) |
| `/admin/providers/:id/verify`| PATCH | Verify/reject provider & set assisted onboarding status | Yes (ADMIN) |
| `/admin/vehicles` | GET | Moderate vehicle listings | Yes (ADMIN) |
| `/admin/vehicles/:id/approve`| PATCH | Approve or deactivate vehicle | Yes (ADMIN) |
| `/admin/bookings` | GET | Audit all city bookings and revenue | Yes (ADMIN) |
| `/admin/disputes` | GET | View open disputes | Yes (ADMIN) |
| `/admin/disputes/:id/resolve`| PATCH | Resolve dispute and issue financial refund decision | Yes (ADMIN) |
