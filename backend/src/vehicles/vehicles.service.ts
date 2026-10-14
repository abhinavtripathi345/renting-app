import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto, SearchVehiclesQueryDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async searchVehicles(query: SearchVehiclesQueryDto) {
    const {
      city,
      category,
      searchQuery,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      providerType,
      verifiedOnly,
      sortBy,
    } = query;

    // Build Prisma where conditions
    const where: any = {
      isApproved: true,
      status: { not: 'INACTIVE' },
    };

    if (city) {
      where.city = {
        name: { contains: city },
      };
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (searchQuery) {
      where.OR = [
        { brand: { contains: searchQuery } },
        { model: { contains: searchQuery } },
        { variant: { contains: searchQuery } },
        { description: { contains: searchQuery } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerDay = {};
      if (minPrice !== undefined) where.pricePerDay.gte = Number(minPrice);
      if (maxPrice !== undefined) where.pricePerDay.lte = Number(maxPrice);
    }

    if (providerType && providerType !== 'ALL') {
      where.provider = {
        ...where.provider,
        providerType: providerType,
      };
    }

    if (verifiedOnly === 'true') {
      where.provider = {
        ...where.provider,
        status: 'VERIFIED',
      };
    }

    // Fetch matching vehicles
    let vehicles = await this.prisma.vehicle.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        city: true,
        area: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            providerType: true,
            status: true,
            rating: true,
            totalRentals: true,
            onboardingType: true,
          },
        },
      },
    });

    // If date range is specified, verify server-side booking availability
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find all overlapping active/confirmed bookings
      const bookedVehicleIds = await this.prisma.booking.findMany({
        where: {
          status: { in: ['CONFIRMED', 'ACTIVE'] },
          OR: [
            {
              startDate: { lte: end },
              endDate: { gte: start },
            },
          ],
        },
        select: { vehicleId: true },
      });

      const bookedSet = new Set(bookedVehicleIds.map((b) => b.vehicleId));
      vehicles = vehicles.filter((v) => !bookedSet.has(v.id));
    }

    // Calculate Best Value Score and format results
    const enhancedVehicles = vehicles.map((v) => {
      // Best value scoring formula:
      // Higher rating rewards score, lower daily price & lower deposit reward score
      const bestValueScore = Number(
        (v.rating * 25 - v.pricePerDay * 0.04 - v.securityDeposit * 0.005).toFixed(2),
      );

      // Calculate approximate demo distance (in km) from area coordinates or mock hub
      const distanceKm = v.area?.name.includes('Sector 17')
        ? 1.8
        : v.area?.name.includes('Sector 35')
        ? 3.2
        : v.area?.name.includes('Mohali')
        ? 4.5
        : v.area?.name.includes('Panchkula')
        ? 5.1
        : 2.5;

      return {
        ...v,
        bestValueScore,
        distanceKm,
        isVerifiedProvider: v.provider.status === 'VERIFIED',
      };
    });

    // Apply Sorting
    if (sortBy === 'price_asc') {
      enhancedVehicles.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price_desc') {
      enhancedVehicles.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'rating_desc') {
      enhancedVehicles.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: best_value
      enhancedVehicles.sort((a, b) => b.bestValueScore - a.bestValueScore);
    }

    return {
      success: true,
      count: enhancedVehicles.length,
      city: city || 'Chandigarh',
      vehicles: enhancedVehicles,
    };
  }

  async compareVehicles(vehicleIds: string[]) {
    if (!vehicleIds || vehicleIds.length < 2) {
      throw new BadRequestException('Provide at least 2 vehicle IDs for comparison');
    }

    const vehicles = await this.prisma.vehicle.findMany({
      where: { id: { in: vehicleIds } },
      include: {
        images: true,
        city: true,
        area: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            providerType: true,
            status: true,
            rating: true,
            totalRentals: true,
          },
        },
      },
    });

    if (vehicles.length === 0) {
      throw new NotFoundException('No matching vehicles found for comparison');
    }

    const comparisonMatrix = vehicles.map((v) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      variant: v.variant,
      category: v.category,
      modelYear: v.modelYear,
      image: v.images[0]?.imageUrl || '',
      provider: v.provider.businessName,
      providerType: v.provider.providerType,
      providerVerified: v.provider.status === 'VERIFIED',
      providerRating: v.provider.rating,
      vehicleRating: v.rating,
      pricePerHour: v.pricePerHour,
      pricePerDay: v.pricePerDay,
      pricePerWeek: v.pricePerWeek || v.pricePerDay * 6,
      securityDeposit: v.securityDeposit,
      mileageLimitKmPerDay: v.mileageLimitKmPerDay,
      excessKmCharge: v.excessKmCharge,
      fuelPolicy: v.fuelPolicy,
      pickupLocation: `${v.area?.name || ''}, ${v.city.name}`,
    }));

    return {
      success: true,
      comparisonCount: comparisonMatrix.length,
      matrix: comparisonMatrix,
    };
  }

  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        city: true,
        area: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            providerType: true,
            status: true,
            rating: true,
            totalRentals: true,
            businessAddress: true,
            onboardingType: true,
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: { select: { fullName: true, profilePhoto: true } },
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle listing not found');
    }

    return {
      success: true,
      vehicle: {
        ...vehicle,
        isVerifiedProvider: vehicle.provider.status === 'VERIFIED',
      },
    };
  }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    if (!provider) {
      throw new ForbiddenException('Only registered providers can list vehicles');
    }

    // Default city to Chandigarh if not provided
    let cityId = dto.cityId;
    if (!cityId) {
      const defaultCity = await this.prisma.city.findFirst({ where: { name: 'Chandigarh' } });
      cityId = defaultCity ? defaultCity.id : undefined;
    }

    if (!cityId) {
      throw new BadRequestException('Valid cityId is required');
    }

    const { imageUrls, ...vehicleData } = dto;

    const vehicle = await this.prisma.vehicle.create({
      data: {
        ...vehicleData,
        providerId: provider.id,
        cityId,
        isApproved: true,
        status: 'AVAILABLE',
        images: imageUrls && imageUrls.length > 0
          ? {
              create: imageUrls.map((url, idx) => ({
                imageUrl: url,
                isPrimary: idx === 0,
                sortOrder: idx,
              })),
            }
          : undefined,
      },
      include: { images: true, city: true, area: true },
    });

    return {
      success: true,
      message: 'Vehicle listed successfully',
      vehicle,
    };
  }

  async updateVehicle(userId: string, vehicleId: string, dto: UpdateVehicleDto) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (provider && vehicle.providerId !== provider.id) {
      throw new ForbiddenException('You do not have permission to modify this vehicle');
    }

    const { imageUrls, ...updateData } = dto;

    const updated = await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { ...updateData },
      include: { images: true, city: true, area: true },
    });

    return {
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: updated,
    };
  }

  async deleteVehicle(userId: string, vehicleId: string) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (provider && vehicle.providerId !== provider.id) {
      throw new ForbiddenException('You do not have permission to delete this vehicle');
    }

    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'INACTIVE' },
    });

    return {
      success: true,
      message: 'Vehicle deactivated successfully',
    };
  }
}
