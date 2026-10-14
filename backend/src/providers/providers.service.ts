import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterProviderDto, UpdateProviderDto } from './dto/provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async registerProvider(userId: string, dto: RegisterProviderDto) {
    const existing = await this.prisma.provider.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new BadRequestException('User already has a registered provider profile');
    }

    // Update user role to PROVIDER if not already
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'PROVIDER' },
    });

    const provider = await this.prisma.provider.create({
      data: {
        userId,
        providerType: dto.providerType,
        businessName: dto.businessName,
        businessAddress: dto.businessAddress,
        gstNumber: dto.gstNumber,
        idProofUrl: dto.idProofUrl,
        businessDocUrl: dto.businessDocUrl,
        cityId: dto.cityId,
        onboardingType: dto.onboardingType || 'SELF_SERVICE',
        status: 'PENDING',
      },
    });

    return {
      success: true,
      message: 'Provider profile registered successfully and submitted for admin verification',
      provider,
    };
  }

  async getMyProviderProfile(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
      include: {
        city: true,
        vehicles: {
          include: {
            images: true,
            _count: { select: { bookings: true, reviews: true } },
          },
        },
      },
    });
    if (!provider) {
      throw new NotFoundException('Provider profile not found for this user');
    }
    return provider;
  }

  async updateProviderProfile(userId: string, dto: UpdateProviderDto) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const updated = await this.prisma.provider.update({
      where: { id: provider.id },
      data: { ...dto },
    });

    return {
      success: true,
      message: 'Provider profile updated successfully',
      provider: updated,
    };
  }

  async getProviderById(providerId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
      include: {
        city: true,
        vehicles: {
          where: { isApproved: true, status: { not: 'INACTIVE' } },
          include: { images: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { customer: { select: { fullName: true, profilePhoto: true } } },
        },
        _count: {
          select: {
            vehicles: true,
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Mask sensitive documents and internal notes for public safety
    return {
      id: provider.id,
      providerType: provider.providerType,
      businessName: provider.businessName,
      status: provider.status,
      isVerified: provider.status === 'VERIFIED',
      rating: provider.rating,
      totalRentals: provider.totalRentals,
      totalReviews: provider.totalReviews,
      city: provider.city?.name,
      businessAddress: provider.businessAddress,
      vehicles: provider.vehicles,
      reviews: provider.reviews,
      stats: provider._count,
    };
  }

  async getDashboardStats(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const totalVehicles = await this.prisma.vehicle.count({
      where: { providerId: provider.id },
    });

    const activeVehicles = await this.prisma.vehicle.count({
      where: { providerId: provider.id, status: 'AVAILABLE' },
    });

    const upcomingBookings = await this.prisma.booking.count({
      where: {
        providerId: provider.id,
        status: 'CONFIRMED',
      },
    });

    const activeRentals = await this.prisma.booking.count({
      where: {
        providerId: provider.id,
        status: 'ACTIVE',
      },
    });

    const completedRentals = await this.prisma.booking.count({
      where: {
        providerId: provider.id,
        status: 'COMPLETED',
      },
    });

    const revenueResult = await this.prisma.booking.aggregate({
      where: {
        providerId: provider.id,
        status: { in: ['COMPLETED', 'ACTIVE', 'CONFIRMED'] },
      },
      _sum: {
        rentalAmount: true,
      },
    });

    const totalEarnings = revenueResult._sum.rentalAmount || 0;

    const recentBookings = await this.prisma.booking.findMany({
      where: { providerId: provider.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { fullName: true, phone: true, verificationStatus: true } },
        vehicle: { select: { brand: true, model: true, registrationNumber: true } },
      },
    });

    return {
      success: true,
      stats: {
        totalVehicles,
        activeVehicles,
        upcomingBookings,
        activeRentals,
        completedRentals,
        averageRating: provider.rating,
        totalEarnings,
        verificationStatus: provider.status,
        isVerified: provider.status === 'VERIFIED',
      },
      recentBookings,
    };
  }
}
