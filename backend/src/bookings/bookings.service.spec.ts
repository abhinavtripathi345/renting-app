import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  const mockPrisma = {
    vehicle: {
      findUnique: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('calculatePrice', () => {
    it('should accurately calculate rental amount, deposit, and platform fee for 2 days', async () => {
      mockPrisma.vehicle.findUnique.mockResolvedValue({
        id: 'v-1',
        brand: 'Royal Enfield',
        model: 'Bullet 350',
        pricePerDay: 750,
        securityDeposit: 1500,
        provider: { businessName: 'CityRiders Hub' },
      });
      mockPrisma.booking.findFirst.mockResolvedValue(null);

      const result = await service.calculatePrice({
        vehicleId: 'v-1',
        startDate: '2026-09-01T10:00:00.000Z',
        endDate: '2026-09-03T10:00:00.000Z', // 48 hours = 2 days
      });

      expect(result.success).toBe(true);
      expect(result.isAvailable).toBe(true);
      expect(result.breakdown.totalDays).toBe(2);
      expect(result.breakdown.rentalAmount).toBe(1500); // 2 * 750
      expect(result.breakdown.securityDeposit).toBe(1500);
      expect(result.breakdown.platformFee).toBe(100);
      expect(result.breakdown.totalAmount).toBe(3100); // 1500 + 1500 + 100
    });

    it('should throw BadRequestException if end date is before start date', async () => {
      await expect(
        service.calculatePrice({
          vehicleId: 'v-1',
          startDate: '2026-09-03T10:00:00.000Z',
          endDate: '2026-09-01T10:00:00.000Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkOverlap & Double Booking Prevention', () => {
    it('should detect overlapping bookings server-side and prevent double-booking', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u-1',
        fullName: 'Test Customer',
      });
      mockPrisma.vehicle.findUnique.mockResolvedValue({
        id: 'v-1',
        status: 'AVAILABLE',
        pricePerDay: 750,
        securityDeposit: 1500,
        providerId: 'p-1',
        provider: { businessName: 'CityRiders Hub' },
        city: { name: 'Chandigarh' },
      });
      // Mock existing booking in overlapping window
      mockPrisma.booking.findFirst.mockResolvedValue({
        id: 'existing-booking-1',
        vehicleId: 'v-1',
        status: 'CONFIRMED',
      });

      await expect(
        service.createBooking('u-1', {
          vehicleId: 'v-1',
          startDate: '2026-09-02T10:00:00.000Z',
          endDate: '2026-09-04T10:00:00.000Z',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
