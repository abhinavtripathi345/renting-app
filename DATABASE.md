# Renting App — Database Architecture & Schema

## Relational Entity-Relationship Structure

```
User (Customer / Provider / Admin)
 ├── Provider Profile (Agency / Individual Owner)
 │    └── Vehicles (Bikes / Scooters)
 │         ├── Vehicle Images
 │         └── Bookings
 ├── Customer Bookings
 │    ├── Payment Record (Razorpay Sandbox)
 │    ├── Digital Rental Agreement (Signed hash)
 │    ├── Condition Reports (Before / After inspection)
 │    ├── Review (Dual-tier rating)
 │    └── Dispute (Claims & resolution)
 └── In-App Notifications
```

---

## Core Tables & Models

1. **`User`**: Core identity table storing phone, email, full name, role (`CUSTOMER`, `PROVIDER`, `ADMIN`), and reusable Driving License verification attributes (`drivingLicenseNo`, `dlExpiryDate`, `dlFrontUrl`, `dlBackUrl`, `aadhaarNo`, `verificationStatus`).
2. **`Provider`**: Agency or Individual Owner profile with business documents, onboarding mode (`SELF_SERVICE`, `ASSISTED`), rating, and verification state (`PENDING`, `VERIFIED`, `SUSPENDED`).
3. **`City` & `Area`**: Scalable multi-city geography starting with **Chandigarh** (`Sector 17`, `Sector 35`, `IT Park`, `Sector 22`).
4. **`Vehicle`**: Fleet listing with category (`BIKE`, `SCOOTER`), pricing (`pricePerDay`, `securityDeposit`, `excessKmCharge`), fuel policy (`SAME_TO_SAME`), and status (`AVAILABLE`, `BOOKED`, `MAINTENANCE`).
5. **`Booking`**: Full lifecycle reservation tracking total days, rental amount, refundable deposit, platform fee, status (`CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED`), and booking source (`ONLINE`, `ONSITE`).
6. **`Payment`**: Transaction records with status (`SUCCESS`, `PENDING`, `REFUNDED`) and transaction IDs.
7. **`RentalAgreement`**: Generated legal contracts with digital signature timestamp and SHA-256 hash.
8. **`ConditionReport`**: Inspection evidence storing odometer reading, fuel %, damage notes, and photo arrays before handover and after return.
9. **`Review`**: Customer feedback maintaining separate `vehicleRating` and `providerRating`.
10. **`Dispute`**: Issue resolution case files with claims, descriptions, and admin notes.
