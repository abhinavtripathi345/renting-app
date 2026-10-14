import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  const mockPrisma = {
    booking: {
      findUnique: jest.fn(),
    },
    review: {
      create: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    vehicle: {
      update: jest.fn(),
    },
    provider: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should reject review submission if booking status is not COMPLETED', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'b-1',
        customerId: 'u-1',
        status: 'ACTIVE', // Not completed yet
        review: null,
      });

      await expect(
        service.createReview('u-1', {
          bookingId: 'b-1',
          vehicleRating: 5,
          providerRating: 5,
          comment: 'Great bike!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject review submission if non-booking user attempts to review', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'b-1',
        customerId: 'u-1',
        status: 'COMPLETED',
        review: null,
      });

      await expect(
        service.createReview('different-user-id', {
          bookingId: 'b-1',
          vehicleRating: 5,
          providerRating: 5,
          comment: 'Great bike!',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should accept review and update vehicle/provider rating when booking is COMPLETED', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'b-1',
        customerId: 'u-1',
        vehicleId: 'v-1',
        providerId: 'p-1',
        status: 'COMPLETED',
        review: null,
      });
      mockPrisma.review.create.mockResolvedValue({
        id: 'r-1',
        vehicleRating: 5,
        providerRating: 5,
      });
      mockPrisma.review.aggregate.mockResolvedValue({
        _avg: { vehicleRating: 4.8, providerRating: 4.9 },
        _count: { id: 10 },
      });

      const result = await service.createReview('u-1', {
        bookingId: 'b-1',
        vehicleRating: 5,
        providerRating: 5,
        comment: 'Superb ride in Chandigarh!',
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.vehicle.update).toHaveBeenCalled();
      expect(mockPrisma.provider.update).toHaveBeenCalled();
    });
  });
});
