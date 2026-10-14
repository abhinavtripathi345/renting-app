export interface User {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  profilePhoto?: string;
  drivingLicenseNo?: string;
  dlExpiryDate?: string;
  dlFrontUrl?: string;
  dlBackUrl?: string;
  aadhaarNo?: string;
  address?: string;
}

export interface Provider {
  id: string;
  userId: string;
  providerType: 'AGENCY' | 'INDIVIDUAL';
  businessName: string;
  businessAddress?: string;
  gstNumber?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  totalRentals: number;
  totalReviews: number;
  onboardingType: 'SELF_SERVICE' | 'ASSISTED';
}

export interface VehicleImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Vehicle {
  id: string;
  providerId: string;
  cityId: string;
  areaId?: string;
  brand: string;
  model: string;
  variant?: string;
  category: 'BIKE' | 'SCOOTER' | 'ELECTRIC_VEHICLE' | 'CAR';
  modelYear: number;
  registrationNumber: string;
  description?: string;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek?: number;
  securityDeposit: number;
  minRentalHours: number;
  mileageLimitKmPerDay: number;
  excessKmCharge: number;
  fuelPolicy: string;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  status: string;
  isApproved: boolean;
  rating: number;
  totalReviews: number;
  images: VehicleImage[];
  provider: Provider;
  area?: { name: string };
  city?: { name: string };
  bestValueScore?: number;
  distanceKm?: number;
  isVerifiedProvider?: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  providerId: string;
  vehicleId: string;
  bookingSource: 'ONLINE' | 'ONSITE';
  startDate: string;
  endDate: string;
  totalDays: number;
  totalHours: number;
  rentalAmount: number;
  securityDeposit: number;
  platformFee: number;
  otherCharges: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'DISPUTED';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  vehicle?: Vehicle;
  provider?: Provider;
  customer?: User;
  rentalAgreement?: {
    agreementNumber: string;
    termsText: string;
    signedAtCustomer?: string;
  };
  conditionReports?: Array<{
    id: string;
    reportType: 'BEFORE_RENTAL' | 'AFTER_RENTAL';
    odometerReading: number;
    fuelLevelPercent: number;
    damageNotes?: string;
    photosJson: string;
    recordedAt: string;
  }>;
  review?: {
    vehicleRating: number;
    providerRating: number;
    comment: string;
  };
}
