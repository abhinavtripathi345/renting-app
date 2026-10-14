import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformMetrics() {
    const totalUsers = await this.prisma.user.count();
    const verifiedUsers = await this.prisma.user.count({ where: { verificationStatus: 'VERIFIED' } });
    const pendingUserVerifications = await this.prisma.user.count({ where: { verificationStatus: 'PENDING' } });

    const totalProviders = await this.prisma.provider.count();
    const verifiedProviders = await this.prisma.provider.count({ where: { status: 'VERIFIED' } });
    const pendingProviders = await this.prisma.provider.count({ where: { status: 'PENDING' } });

    const totalVehicles = await this.prisma.vehicle.count();
    const availableVehicles = await this.prisma.vehicle.count({ where: { status: 'AVAILABLE', isApproved: true } });

    const totalBookings = await this.prisma.booking.count();
    const activeBookings = await this.prisma.booking.count({ where: { status: 'ACTIVE' } });
    const completedBookings = await this.prisma.booking.count({ where: { status: 'COMPLETED' } });

    const revenueResult = await this.prisma.booking.aggregate({
      where: { status: { in: ['COMPLETED', 'ACTIVE', 'CONFIRMED'] } },
      _sum: {
        totalAmount: true,
        platformFee: true,
        rentalAmount: true,
      },
    });

    const openDisputes = await this.prisma.dispute.count({ where: { status: 'OPEN' } });

    return {
      success: true,
      metrics: {
        totalUsers,
        verifiedUsers,
        pendingUserVerifications,
        totalProviders,
        verifiedProviders,
        pendingProviders,
        totalVehicles,
        availableVehicles,
        totalBookings,
        activeBookings,
        completedBookings,
        grossMerchandiseValue: revenueResult._sum.totalAmount || 0,
        platformRevenue: revenueResult._sum.platformFee || 0,
        openDisputes,
      },
    };
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        providerProfile: true,
        _count: { select: { customerBookings: true } },
      },
    });
    return { success: true, count: users.length, users };
  }

  async verifyUser(userId: string, status: 'VERIFIED' | 'REJECTED', note?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status,
        verificationNote: note,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId,
        title: status === 'VERIFIED' ? 'Verification Approved! 🎉' : 'Verification Rejected',
        message: status === 'VERIFIED'
          ? 'Your driving license and ID have been approved. You are now verified to rent any eligible vehicle!'
          : `Your verification was rejected: ${note || 'Please re-upload clear document copies.'}`,
        type: 'VERIFICATION',
      },
    });

    return { success: true, message: `User verification marked as ${status}`, user: updated };
  }

  async toggleSuspendUser(userId: string, isSuspended: boolean) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended },
    });
    return { success: true, user: updated };
  }

  async getProviders() {
    const providers = await this.prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, phone: true, email: true } },
        city: true,
        _count: { select: { vehicles: true, bookings: true } },
      },
    });
    return { success: true, count: providers.length, providers };
  }

  async verifyProvider(providerId: string, status: 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW') {
    const provider = await this.prisma.provider.findUnique({ where: { id: providerId } });
    if (!provider) throw new NotFoundException('Provider not found');

    const updated = await this.prisma.provider.update({
      where: { id: providerId },
      data: { status },
    });

    await this.prisma.notification.create({
      data: {
        userId: provider.userId,
        title: `Provider Status: ${status}`,
        message: `Your provider profile has been marked as ${status} by platform administration.`,
        type: 'VERIFICATION',
      },
    });

    return { success: true, message: `Provider status updated to ${status}`, provider: updated };
  }

  async markAssistedOnboarding(providerId: string, representativeId?: string) {
    const updated = await this.prisma.provider.update({
      where: { id: providerId },
      data: {
        onboardingType: 'ASSISTED',
        onboardingRepresentativeId: representativeId || 'ADMIN_REP_001',
      },
    });
    return { success: true, message: 'Provider marked as assisted onboarding', provider: updated };
  }

  async getVehicles() {
    const vehicles = await this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        provider: true,
        city: true,
        area: true,
        _count: { select: { bookings: true } },
      },
    });
    return { success: true, count: vehicles.length, vehicles };
  }

  async approveVehicle(vehicleId: string, isApproved: boolean) {
    const updated = await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { isApproved },
    });
    return { success: true, vehicle: updated };
  }

  async getBookingsMaster() {
    const bookings = await this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { include: { images: true } },
        provider: true,
        customer: { select: { fullName: true, phone: true, email: true, verificationStatus: true } },
        payment: true,
        rentalAgreement: true,
      },
    });
    return { success: true, count: bookings.length, bookings };
  }
}
