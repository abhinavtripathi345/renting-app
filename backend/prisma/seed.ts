import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Renting App Seed Script...');

  // Clean existing database
  await prisma.notification.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.review.deleteMany();
  await prisma.conditionReport.deleteMany();
  await prisma.rentalAgreement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicleImage.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.area.deleteMany();
  await prisma.city.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 1. Create Default City (Chandigarh) and Areas
  const chandigarh = await prisma.city.create({
    data: {
      name: 'Chandigarh',
      state: 'Punjab & Haryana',
      isActive: true,
      areas: {
        create: [
          { name: 'Sector 17 (City Center)', pincode: '160017', latitude: 30.7398, longitude: 76.7827 },
          { name: 'Sector 35 (Market Hub)', pincode: '160035', latitude: 30.7244, longitude: 76.7621 },
          { name: 'IT Park / Kishangarh', pincode: '160101', latitude: 30.7226, longitude: 76.8368 },
          { name: 'Mohali Phase 7', pincode: '160062', latitude: 30.7046, longitude: 76.7179 },
          { name: 'Panchkula Sector 5', pincode: '134109', latitude: 30.6942, longitude: 76.8606 },
        ],
      },
    },
    include: { areas: true },
  });

  const sec17 = chandigarh.areas.find((a) => a.name.includes('Sector 17'))!;
  const sec35 = chandigarh.areas.find((a) => a.name.includes('Sector 35'))!;
  const itPark = chandigarh.areas.find((a) => a.name.includes('IT Park'))!;
  const mohali = chandigarh.areas.find((a) => a.name.includes('Mohali'))!;
  const panchkula = chandigarh.areas.find((a) => a.name.includes('Panchkula'))!;

  console.log(`📍 Created City: ${chandigarh.name} with ${chandigarh.areas.length} areas.`);

  // 2. Create Platform Admin
  const admin = await prisma.user.create({
    data: {
      phone: '+919876500000',
      email: 'admin@rentingapp.in',
      fullName: 'System Administrator',
      role: 'ADMIN',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
    },
  });

  // 3. Create Sample Customers
  const customer1 = await prisma.user.create({
    data: {
      phone: '+919876543210',
      email: 'aarav.verma@example.com',
      fullName: 'Aarav Verma',
      role: 'CUSTOMER',
      verificationStatus: 'VERIFIED',
      drivingLicenseNo: 'CH-01-2021-0098472',
      dlExpiryDate: '2035-10-15',
      dlFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      dlBackUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      aadhaarNo: 'XXXXXXXX9876',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      verifiedAt: new Date('2026-01-10'),
      address: 'House 412, Sector 22-B, Chandigarh',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      phone: '+919876543211',
      email: 'pooja.mehra@example.com',
      fullName: 'Pooja Mehra',
      role: 'CUSTOMER',
      verificationStatus: 'PENDING',
      drivingLicenseNo: 'PB-65-2023-0012345',
      dlExpiryDate: '2038-04-20',
      dlFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      verifiedAt: null,
      address: 'Phase 3B2, Mohali',
    },
  });

  // 4. Create Rental Agencies (3 Agencies)
  // Agency 1: Chandigarh Bike Rentals (Sector 17)
  const agencyUser1 = await prisma.user.create({
    data: {
      phone: '+919876511111',
      email: 'contact@chandigarhrentals.com',
      fullName: 'Anil Kapoor (Chandigarh Bike Rentals)',
      role: 'PROVIDER',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2025-11-01'),
    },
  });

  const agency1 = await prisma.provider.create({
    data: {
      userId: agencyUser1.id,
      providerType: 'AGENCY',
      businessName: 'Chandigarh Bike Rentals',
      businessAddress: 'SCO 45-46, Sector 17-C, Chandigarh',
      gstNumber: '04AABCC1234D1Z5',
      onboardingType: 'ASSISTED',
      status: 'VERIFIED',
      rating: 4.8,
      totalRentals: 145,
      totalReviews: 48,
      cityId: chandigarh.id,
    },
  });

  // Agency 2: CityRiders Hub (Sector 35)
  const agencyUser2 = await prisma.user.create({
    data: {
      phone: '+919876522222',
      email: 'info@cityridershub.in',
      fullName: 'Gurpreet Singh (CityRiders Hub)',
      role: 'PROVIDER',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2025-12-05'),
    },
  });

  const agency2 = await prisma.provider.create({
    data: {
      userId: agencyUser2.id,
      providerType: 'AGENCY',
      businessName: 'CityRiders Hub',
      businessAddress: 'Booth 112, Sector 35-C Inner Market, Chandigarh',
      gstNumber: '04AABCR5678E1Z9',
      onboardingType: 'SELF_SERVICE',
      status: 'VERIFIED',
      rating: 4.5,
      totalRentals: 88,
      totalReviews: 29,
      cityId: chandigarh.id,
    },
  });

  // Agency 3: Tricity Wheels (IT Park)
  const agencyUser3 = await prisma.user.create({
    data: {
      phone: '+919876533333',
      email: 'support@tricitywheels.com',
      fullName: 'Harpreet Kaur (Tricity Wheels)',
      role: 'PROVIDER',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-01-02'),
    },
  });

  const agency3 = await prisma.provider.create({
    data: {
      userId: agencyUser3.id,
      providerType: 'AGENCY',
      businessName: 'Tricity Wheels',
      businessAddress: 'Tower B Ground Floor, DLF Cyber City, IT Park, Chandigarh',
      gstNumber: '04AABCT9988F1Z1',
      onboardingType: 'ASSISTED',
      status: 'VERIFIED',
      rating: 4.3,
      totalRentals: 52,
      totalReviews: 18,
      cityId: chandigarh.id,
    },
  });

  // 5. Create Individual Vehicle Owners (2 Owners)
  // Owner 1: Rajesh Sharma (Mohali)
  const ownerUser1 = await prisma.user.create({
    data: {
      phone: '+919876544444',
      email: 'rajesh.sharma.trips@example.com',
      fullName: 'Rajesh Sharma',
      role: 'PROVIDER',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2025-10-15'),
    },
  });

  const owner1 = await prisma.provider.create({
    data: {
      userId: ownerUser1.id,
      providerType: 'INDIVIDUAL',
      businessName: 'Rajesh Sharma (Verified Owner)',
      businessAddress: 'House 564, Phase 7, Mohali',
      onboardingType: 'SELF_SERVICE',
      status: 'VERIFIED',
      rating: 4.9,
      totalRentals: 24,
      totalReviews: 12,
      cityId: chandigarh.id,
    },
  });

  // Owner 2: Vikram Singh (Panchkula)
  const ownerUser2 = await prisma.user.create({
    data: {
      phone: '+919876555555',
      email: 'vikram.singh.riders@example.com',
      fullName: 'Vikram Singh',
      role: 'PROVIDER',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date('2026-01-20'),
    },
  });

  const owner2 = await prisma.provider.create({
    data: {
      userId: ownerUser2.id,
      providerType: 'INDIVIDUAL',
      businessName: 'Vikram Singh (Verified Owner)',
      businessAddress: 'Flat 302, GH-12, Sector 5, Panchkula',
      onboardingType: 'ASSISTED',
      status: 'VERIFIED',
      rating: 4.7,
      totalRentals: 18,
      totalReviews: 7,
      cityId: chandigarh.id,
    },
  });

  console.log('🏢 Created 3 Agencies and 2 Individual Owners.');

  // 6. Create Vehicles (Multi-Provider Comparison Fleet)
  // Bullet 1 (Agency 1 - Chandigarh Bike Rentals): ₹900/day, ₹2000 deposit, 4.8 rating
  const bullet1 = await prisma.vehicle.create({
    data: {
      providerId: agency1.id,
      cityId: chandigarh.id,
      areaId: sec17.id,
      brand: 'Royal Enfield',
      model: 'Bullet 350',
      variant: 'Standard BS6 Maroon',
      category: 'BIKE',
      modelYear: 2024,
      registrationNumber: 'CH-01-CK-3450',
      description: 'Pristine Royal Enfield Bullet 350 with classic thumping exhaust. Freshly serviced, comes with 2 sanitized helmets and mobile mount. Ideal for city cruise and mountain trips.',
      pricePerHour: 75.0,
      pricePerDay: 900.0,
      pricePerWeek: 5400.0,
      securityDeposit: 2000.0,
      minRentalHours: 4,
      mileageLimitKmPerDay: 200,
      excessKmCharge: 6.0,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'SCO 45-46, Sector 17-C, Chandigarh (Near Neelam Cinema)',
      pickupLatitude: 30.7398,
      pickupLongitude: 76.7827,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.8,
      totalReviews: 24,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800', isPrimary: true, sortOrder: 0 },
          { imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', isPrimary: false, sortOrder: 1 },
        ],
      },
    },
  });

  // Bullet 2 (Agency 2 - CityRiders Hub): ₹750/day, ₹1500 deposit, 4.4 rating
  const bullet2 = await prisma.vehicle.create({
    data: {
      providerId: agency2.id,
      cityId: chandigarh.id,
      areaId: sec35.id,
      brand: 'Royal Enfield',
      model: 'Bullet 350',
      variant: 'Electra Black',
      category: 'BIKE',
      modelYear: 2023,
      registrationNumber: 'CH-01-BT-8921',
      description: 'Reliable Bullet 350 Electra in great mechanical condition. Electric start, disc brakes, tubeless tyres with crash guard.',
      pricePerHour: 60.0,
      pricePerDay: 750.0,
      pricePerWeek: 4500.0,
      securityDeposit: 1500.0,
      minRentalHours: 4,
      mileageLimitKmPerDay: 180,
      excessKmCharge: 5.0,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'Booth 112, Sector 35-C Market, Chandigarh',
      pickupLatitude: 30.7244,
      pickupLongitude: 76.7621,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.4,
      totalReviews: 19,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800', isPrimary: true, sortOrder: 0 },
          { imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800', isPrimary: false, sortOrder: 1 },
        ],
      },
    },
  });

  // Bullet 3 (Owner 1 - Rajesh Sharma): ₹650/day, ₹1000 deposit, 4.9 rating (Best Value)
  const bullet3 = await prisma.vehicle.create({
    data: {
      providerId: owner1.id,
      cityId: chandigarh.id,
      areaId: mohali.id,
      brand: 'Royal Enfield',
      model: 'Bullet 350',
      variant: 'Classic Jet Black',
      category: 'BIKE',
      modelYear: 2024,
      registrationNumber: 'PB-65-AX-5511',
      description: 'Personal bike in showroom condition. Low mileage, buttery smooth engine. Includes complimentary helmet and disc lock. Friendly owner handover.',
      pricePerHour: 50.0,
      pricePerDay: 650.0,
      pricePerWeek: 3900.0,
      securityDeposit: 1000.0,
      minRentalHours: 4,
      mileageLimitKmPerDay: 200,
      excessKmCharge: 5.0,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'House 564, Phase 7, Mohali (Near YPS Chowk)',
      pickupLatitude: 30.7046,
      pickupLongitude: 76.7179,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.9,
      totalReviews: 12,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800', isPrimary: true, sortOrder: 0 },
          { imageUrl: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800', isPrimary: false, sortOrder: 1 },
        ],
      },
    },
  });

  // Himalayan 1 (Agency 1): ₹1400/day, ₹3000 deposit, 4.9 rating
  const himalayan1 = await prisma.vehicle.create({
    data: {
      providerId: agency1.id,
      cityId: chandigarh.id,
      areaId: sec17.id,
      brand: 'Royal Enfield',
      model: 'Himalayan 411',
      variant: 'Pine Green Adventure Edition',
      category: 'BIKE',
      modelYear: 2024,
      registrationNumber: 'CH-01-CK-9901',
      description: 'Equipped with heavy-duty panniers, high windscreen, and dual-channel ABS. Perfect for Shimla, Manali, and Spiti expedition trips.',
      pricePerHour: 110.0,
      pricePerDay: 1400.0,
      pricePerWeek: 8400.0,
      securityDeposit: 3000.0,
      minRentalHours: 6,
      mileageLimitKmPerDay: 250,
      excessKmCharge: 7.0,
      fuelPolicy: 'FULL_TO_FULL',
      pickupAddress: 'SCO 45-46, Sector 17-C, Chandigarh',
      pickupLatitude: 30.7398,
      pickupLongitude: 76.7827,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.9,
      totalReviews: 15,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  // Himalayan 2 (Owner 2 - Vikram Singh): ₹1200/day, ₹2500 deposit, 4.7 rating
  const himalayan2 = await prisma.vehicle.create({
    data: {
      providerId: owner2.id,
      cityId: chandigarh.id,
      areaId: panchkula.id,
      brand: 'Royal Enfield',
      model: 'Himalayan 411',
      variant: 'Gravel Grey BS6',
      category: 'BIKE',
      modelYear: 2023,
      registrationNumber: 'HR-03-R-4422',
      description: 'Well-maintained adventure tourer with custom touring seat and auxiliary fog lights. Hassle-free documentation.',
      pricePerHour: 95.0,
      pricePerDay: 1200.0,
      pricePerWeek: 7200.0,
      securityDeposit: 2500.0,
      minRentalHours: 6,
      mileageLimitKmPerDay: 220,
      excessKmCharge: 6.0,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'Sector 5 Market, Panchkula (Behind Bella Vista)',
      pickupLatitude: 30.6942,
      pickupLongitude: 76.8606,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.7,
      totalReviews: 9,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  // Scooter 1: Honda Activa 6G (Agency 2 - CityRiders Hub): ₹450/day, ₹1000 deposit
  const activa = await prisma.vehicle.create({
    data: {
      providerId: agency2.id,
      cityId: chandigarh.id,
      areaId: sec35.id,
      brand: 'Honda',
      model: 'Activa 6G',
      variant: 'Deluxe Pearl White',
      category: 'SCOOTER',
      modelYear: 2024,
      registrationNumber: 'CH-01-CK-7711',
      description: 'Super fuel-efficient Honda Activa 6G with telescopic suspension and external fuel lid. Ideal for quick city errands, shopping, and campus commute.',
      pricePerHour: 40.0,
      pricePerDay: 450.0,
      pricePerWeek: 2700.0,
      securityDeposit: 1000.0,
      minRentalHours: 3,
      mileageLimitKmPerDay: 150,
      excessKmCharge: 4.0,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'Booth 112, Sector 35-C Market, Chandigarh',
      pickupLatitude: 30.7244,
      pickupLongitude: 76.7621,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.6,
      totalReviews: 32,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  // Scooter 2: TVS Jupiter 125 (Agency 3 - Tricity Wheels): ₹400/day, ₹800 deposit
  const jupiter = await prisma.vehicle.create({
    data: {
      providerId: agency3.id,
      cityId: chandigarh.id,
      areaId: itPark.id,
      brand: 'TVS',
      model: 'Jupiter 125',
      variant: 'Disc SmartXonnect',
      category: 'SCOOTER',
      modelYear: 2023,
      registrationNumber: 'CH-01-BT-3329',
      description: 'Spacious legroom, 33-litre underseat storage (fits 2 full helmets), USB phone charger, and smooth metal body.',
      pricePerHour: 35.0,
      pricePerDay: 400.0,
      pricePerWeek: 2400.0,
      securityDeposit: 800.0,
      minRentalHours: 3,
      mileageLimitKmPerDay: 140,
      excessKmCharge: 4.0,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'Tower B, DLF Cyber City, IT Park, Chandigarh',
      pickupLatitude: 30.7226,
      pickupLongitude: 76.8368,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.3,
      totalReviews: 14,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  // Scooter 3: TVS Ntorq 125 (Owner 1 - Rajesh Sharma): ₹500/day, ₹1200 deposit
  const ntorq = await prisma.vehicle.create({
    data: {
      providerId: owner1.id,
      cityId: chandigarh.id,
      areaId: mohali.id,
      brand: 'TVS',
      model: 'Ntorq 125',
      variant: 'Race Edition Yellow/Black',
      category: 'SCOOTER',
      modelYear: 2024,
      registrationNumber: 'PB-65-AY-9009',
      description: 'Sporty 125cc performance scooter with Bluetooth navigation cluster and peppy acceleration.',
      pricePerHour: 45.0,
      pricePerDay: 500.0,
      pricePerWeek: 3000.0,
      securityDeposit: 1200.0,
      minRentalHours: 3,
      mileageLimitKmPerDay: 160,
      excessKmCharge: 4.5,
      fuelPolicy: 'SAME_TO_SAME',
      pickupAddress: 'Phase 7, Mohali',
      pickupLatitude: 30.7046,
      pickupLongitude: 76.7179,
      status: 'AVAILABLE',
      isApproved: true,
      rating: 4.8,
      totalReviews: 8,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  console.log('🏍️ Created 8 Vehicles across Bullets, Himalayans, and Scooters.');

  // 7. Create a Sample Completed Booking with Condition Reports, Rental Agreement, and Dual-Rating Review
  const sampleStartDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  const sampleEndDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago (2 days rental)

  const completedBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'RENT-2026-CH001',
      customerId: customer1.id,
      providerId: agency1.id,
      vehicleId: bullet1.id,
      bookingSource: 'ONLINE',
      startDate: sampleStartDate,
      endDate: sampleEndDate,
      totalDays: 2,
      totalHours: 48.0,
      rentalAmount: 1800.0, // 2 days * 900
      securityDeposit: 2000.0,
      platformFee: 100.0,
      otherCharges: 0.0,
      totalAmount: 3900.0,
      status: 'COMPLETED',
      paymentStatus: 'SUCCESS',
      handoverAt: sampleStartDate,
      returnedAt: sampleEndDate,
      payment: {
        create: {
          customerId: customer1.id,
          amount: 3900.0,
          paymentType: 'RENTAL_AND_DEPOSIT',
          status: 'SUCCESS',
          transactionId: 'pay_sandbox_tx_998811',
          provider: 'RAZORPAY_SANDBOX',
        },
      },
      rentalAgreement: {
        create: {
          agreementNumber: 'AGR-2026-0001',
          termsText: 'Digital Rental Agreement: Renter agrees to operate vehicle CH-01-CK-3450 safely. Security deposit of INR 2000 is refundable upon damage-free return. Standard speed limit 80km/h.',
          signedAtCustomer: sampleStartDate,
          signatureCustomerUrl: 'https://images.unsplash.com/signature_sample.png',
          digitalSignatureHash: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      },
      conditionReports: {
        create: [
          {
            reportType: 'BEFORE_RENTAL',
            odometerReading: 12450.0,
            fuelLevelPercent: 95.0,
            damageNotes: 'Minor hairline scratch on left silencer shield. All lights, brakes and horn tested OK.',
            photosJson: JSON.stringify([
              'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
            ]),
            recordedByUserId: agencyUser1.id,
            recordedAt: sampleStartDate,
          },
          {
            reportType: 'AFTER_RENTAL',
            odometerReading: 12710.0,
            fuelLevelPercent: 92.0,
            damageNotes: 'Vehicle returned in clean condition. No new dents or scratches observed. Full deposit refunded.',
            photosJson: JSON.stringify([
              'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
            ]),
            recordedByUserId: agencyUser1.id,
            recordedAt: sampleEndDate,
          },
        ],
      },
      review: {
        create: {
          customerId: customer1.id,
          vehicleId: bullet1.id,
          providerId: agency1.id,
          vehicleRating: 5.0,
          providerRating: 5.0,
          comment: 'Outstanding experience! The Bullet 350 ran like butter through Kasauli hills. Fast verification and immediate deposit refund.',
        },
      },
    },
  });

  // 8. Create a Sample Active Dispute for Demo and Admin Center
  const disputeStartDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const disputeEndDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

  const disputeBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'RENT-2026-CH002',
      customerId: customer1.id,
      providerId: agency2.id,
      vehicleId: activa.id,
      bookingSource: 'ONLINE',
      startDate: disputeStartDate,
      endDate: disputeEndDate,
      totalDays: 1,
      totalHours: 24.0,
      rentalAmount: 450.0,
      securityDeposit: 1000.0,
      platformFee: 100.0,
      totalAmount: 1550.0,
      status: 'DISPUTED',
      paymentStatus: 'SUCCESS',
      handoverAt: disputeStartDate,
      returnedAt: disputeEndDate,
      disputes: {
        create: {
          initiatedByUserId: customer1.id,
          title: 'Disputed scratch claim on Activa front fender',
          description: 'Provider claimed ₹400 for a front panel scratch that was already present during pickup condition inspection.',
          evidencePhotosJson: JSON.stringify([
            'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800',
          ]),
          claimAmount: 400.0,
          status: 'OPEN',
          providerResponse: 'The scratch appeared deeper upon wash, but we are open to admin review of pickup condition report.',
        },
      },
    },
  });

  console.log(`✅ Seed Completed Successfully!`);
  console.log(`📊 Summary:`);
  console.log(`- 1 City (Chandigarh) with 5 Strategic Areas`);
  console.log(`- 1 System Admin (+919876500000)`);
  console.log(`- 2 Customers (+919876543210 Verified, +919876543211 Pending)`);
  console.log(`- 3 Rental Agencies (Chandigarh Bike Rentals, CityRiders Hub, Tricity Wheels)`);
  console.log(`- 2 Individual Owners (Rajesh Sharma, Vikram Singh)`);
  console.log(`- 8 Fleet Listings (3 Bullets with ₹650-₹900 price variance, 2 Himalayans, 3 Scooters)`);
  console.log(`- 1 Completed Booking with Condition Reports, Digital Agreement & 5-Star Dual Review`);
  console.log(`- 1 Sample Dispute for Admin resolution`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
