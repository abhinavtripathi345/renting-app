import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatePriceDto, CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(dto: CalculatePriceDto) {
    const { vehicleId, startDate, endDate } = dto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (start >= end) {
      throw new BadRequestException('End date must be strictly after start date');
    }

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { provider: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Calculate duration in milliseconds, hours, and fractional days
    const diffMs = end.getTime() - start.getTime();
    const totalHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const totalDays = Math.max(1, Math.ceil(totalHours / 24));

    // Pricing calculation
    let rentalAmount = 0;
    if (totalDays >= 7 && vehicle.pricePerWeek) {
      const weeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;
      rentalAmount = weeks * vehicle.pricePerWeek + remDays * vehicle.pricePerDay;
    } else {
      rentalAmount = totalDays * vehicle.pricePerDay;
    }

    const securityDeposit = vehicle.securityDeposit;
    const platformFee = 100.0; // Flat platform service & insurance fee
    const otherCharges = 0.0;
    const totalAmount = rentalAmount + securityDeposit + platformFee + otherCharges;

    // Check server-side availability for these dates
    const hasOverlap = await this.checkOverlap(vehicleId, start, end);

    return {
      success: true,
      isAvailable: !hasOverlap,
      breakdown: {
        totalHours,
        totalDays,
        pricePerDay: vehicle.pricePerDay,
        rentalAmount,
        securityDeposit,
        platformFee,
        otherCharges,
        totalAmount,
      },
      vehicle: {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        variant: vehicle.variant,
        provider: vehicle.provider.businessName,
      },
    };
  }

  async checkOverlap(vehicleId: string, startDate: Date, endDate: Date, excludeBookingId?: string): Promise<boolean> {
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        vehicleId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });

    return !!overlapping;
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { vehicleId, startDate, endDate, bookingSource, customerSignatureNotes } = dto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('End date must be strictly after start date');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Customer user not found');
    }

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { provider: true, city: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle listing not found');
    }

    if (vehicle.status === 'MAINTENANCE' || vehicle.status === 'INACTIVE') {
      throw new BadRequestException(`Vehicle is currently ${vehicle.status} and not open for bookings`);
    }

    // SERVER-SIDE DOUBLE BOOKING CHECK
    const isOverlapping = await this.checkOverlap(vehicleId, start, end);
    if (isOverlapping) {
      throw new ConflictException(
        'Vehicle is already booked or reserved for the selected rental dates. Please choose another date or vehicle.',
      );
    }

    // Price calculation
    const diffMs = end.getTime() - start.getTime();
    const totalHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const totalDays = Math.max(1, Math.ceil(totalHours / 24));
    const rentalAmount = totalDays * vehicle.pricePerDay;
    const securityDeposit = vehicle.securityDeposit;
    const platformFee = 100.0;
    const otherCharges = 0.0;
    const totalAmount = rentalAmount + securityDeposit + platformFee + otherCharges;

    const bookingNumber = `RENT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create booking and associated Digital Rental Agreement
    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber,
        customerId: userId,
        providerId: vehicle.providerId,
        vehicleId: vehicle.id,
        bookingSource: bookingSource || 'ONLINE',
        startDate: start,
        endDate: end,
        totalDays,
        totalHours,
        rentalAmount,
        securityDeposit,
        platformFee,
        otherCharges,
        totalAmount,
        status: 'CONFIRMED',
        paymentStatus: 'SUCCESS', // Test / Sandbox auto-success
        payment: {
          create: {
            customerId: userId,
            amount: totalAmount,
            paymentType: 'RENTAL_AND_DEPOSIT',
            status: 'SUCCESS',
            transactionId: `pay_sandbox_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            provider: 'RAZORPAY_SANDBOX',
          },
        },
        rentalAgreement: {
          create: {
            agreementNumber: `AGR-${bookingNumber}`,
            termsText: `DIGITAL VEHICLE RENTAL AGREEMENT
Platform: Renting App (${vehicle.city.name})
Renter: ${user.fullName} (${user.phone})
Provider: ${vehicle.provider.businessName}
Vehicle: ${vehicle.brand} ${vehicle.model} (${vehicle.registrationNumber})
Rental Period: ${start.toLocaleString()} to ${end.toLocaleString()} (${totalDays} days)
Rental Charges: ₹${rentalAmount}
Refundable Security Deposit: ₹${securityDeposit}
Mileage Allowance: ${vehicle.mileageLimitKmPerDay} km/day (Excess ₹${vehicle.excessKmCharge}/km)
Fuel Policy: ${vehicle.fuelPolicy}
General Terms: Renter agrees to follow all traffic laws, wear helmets, and return vehicle in same mechanical condition.`,
            signedAtCustomer: new Date(),
            signatureCustomerUrl: customerSignatureNotes || `Digitally accepted by ${user.fullName}`,
            digitalSignatureHash: `sha256_${Date.now()}_${user.id.substring(0, 8)}`,
          },
        },
      },
      include: {
        vehicle: { include: { images: true } },
        provider: true,
        payment: true,
        rentalAgreement: true,
        customer: { select: { id: true, fullName: true, phone: true, email: true } },
      },
    });

    // Create Notification for Customer
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Booking Confirmed!',
        message: `Your booking #${booking.bookingNumber} for ${vehicle.brand} ${vehicle.model} has been confirmed.`,
        type: 'BOOKING',
      },
    });

    return {
      success: true,
      message: 'Booking created and confirmed successfully',
      booking,
    };
  }

  async getBookings(userId: string, role: string, status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (role === 'ADMIN') {
      // Admin sees all bookings
    } else if (role === 'PROVIDER') {
      const provider = await this.prisma.provider.findUnique({ where: { userId } });
      if (!provider) {
        return { success: true, count: 0, bookings: [] };
      }
      where.providerId = provider.id;
    } else {
      // Customer sees own bookings
      where.customerId = userId;
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { include: { images: true, city: true, area: true } },
        provider: true,
        customer: { select: { id: true, fullName: true, phone: true, verificationStatus: true } },
        payment: true,
        rentalAgreement: true,
        conditionReports: true,
        review: true,
        disputes: true,
      },
    });

    return {
      success: true,
      count: bookings.length,
      bookings,
    };
  }

  async getBookingById(userId: string, role: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: { include: { images: true, city: true, area: true } },
        provider: true,
        customer: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            drivingLicenseNo: true,
            verificationStatus: true,
          },
        },
        payment: true,
        rentalAgreement: true,
        conditionReports: { include: { recordedByUser: { select: { fullName: true } } } },
        review: true,
        disputes: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify access permission
    if (role !== 'ADMIN' && booking.customerId !== userId) {
      const provider = await this.prisma.provider.findUnique({ where: { userId } });
      if (!provider || booking.providerId !== provider.id) {
        throw new ForbiddenException('You do not have access to view this booking');
      }
    }

    return {
      success: true,
      booking,
    };
  }

  async updateBookingStatus(userId: string, role: string, bookingId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { provider: true, customer: true, vehicle: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Permission check
    if (role === 'CUSTOMER') {
      if (booking.customerId !== userId) {
        throw new ForbiddenException('Permission denied');
      }
      if (dto.status !== 'CANCELLED') {
        throw new BadRequestException('Customers may only cancel a booking');
      }
    } else if (role === 'PROVIDER') {
      const provider = await this.prisma.provider.findUnique({ where: { userId } });
      if (!provider || booking.providerId !== provider.id) {
        throw new ForbiddenException('Permission denied for this provider');
      }
    }

    const updateData: any = { status: dto.status };
    if (dto.status === 'ACTIVE') {
      updateData.handoverAt = new Date();
    } else if (dto.status === 'COMPLETED') {
      updateData.returnedAt = new Date();
      // Increment provider total rentals
      await this.prisma.provider.update({
        where: { id: booking.providerId },
        data: { totalRentals: { increment: 1 } },
      });
    } else if (dto.status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = userId;
      updateData.cancellationReason = dto.notes || 'Cancelled by user';
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    // Notify customer
    await this.prisma.notification.create({
      data: {
        userId: booking.customerId,
        title: `Booking Status: ${dto.status}`,
        message: `Your booking #${booking.bookingNumber} is now marked as ${dto.status}.`,
        type: 'BOOKING',
      },
    });

    return {
      success: true,
      message: `Booking status updated to ${dto.status}`,
      booking: updated,
    };
  }
}
