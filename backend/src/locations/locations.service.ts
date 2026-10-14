import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getCities() {
    const cities = await this.prisma.city.findMany({
      where: { isActive: true },
      include: {
        areas: true,
        _count: {
          select: {
            vehicles: { where: { isApproved: true, status: 'AVAILABLE' } },
            providers: { where: { status: 'VERIFIED' } },
          },
        },
      },
    });

    return {
      success: true,
      count: cities.length,
      cities: cities.map((c) => ({
        id: c.id,
        name: c.name,
        state: c.state,
        areas: c.areas,
        availableVehiclesCount: c._count.vehicles,
        verifiedProvidersCount: c._count.providers,
      })),
    };
  }

  async getAreasByCity(cityId: string) {
    const areas = await this.prisma.area.findMany({
      where: { cityId },
      include: {
        _count: {
          select: { vehicles: { where: { isApproved: true, status: 'AVAILABLE' } } },
        },
      },
    });

    return {
      success: true,
      count: areas.length,
      areas,
    };
  }
}
