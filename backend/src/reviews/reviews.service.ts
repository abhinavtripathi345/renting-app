import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new ForbiddenException('Only the customer who completed this booking can submit a review');
    }

    // RULE: Reviews are only allowed for COMPLETED bookings
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Reviews are only allowed after a rental is officially completed');
    }

    if (booking.review) {
      throw new ConflictException('A review has already been submitted for this booking');
    }

    const review = await this.prisma.review.create({
      data: {
        bookingId: booking.id,
        customerId: userId,
        vehicleId: booking.vehicleId,
        providerId: booking.providerId,
        vehicleRating: dto.vehicleRating,
        providerRating: dto.providerRating,
        comment: dto.comment,
      },
      include: {
        customer: { select: { fullName: true, profilePhoto: true } },
      },
    });

    // Recompute Vehicle Average Rating
    const vehicleReviews = await this.prisma.review.aggregate({
      where: { vehicleId: booking.vehicleId },
      _avg: { vehicleRating: true },
      _count: { id: true },
    });

    if (vehicleReviews._avg.vehicleRating !== null) {
      await this.prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: {
          rating: Number(vehicleReviews._avg.vehicleRating.toFixed(1)),
          totalReviews: vehicleReviews._count.id,
        },
      });
    }

    // Recompute Provider Average Rating
    const providerReviews = await this.prisma.review.aggregate({
      where: { providerId: booking.providerId },
      _avg: { providerRating: true },
      _count: { id: true },
    });

    if (providerReviews._avg.providerRating !== null) {
      await this.prisma.provider.update({
        where: { id: booking.providerId },
        data: {
          rating: Number(providerReviews._avg.providerRating.toFixed(1)),
          totalReviews: providerReviews._count.id,
        },
      });
    }

    return {
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      review,
    };
  }

  async getReviewsForVehicle(vehicleId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { vehicleId, isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { fullName: true, profilePhoto: true } },
      },
    });

    return {
      success: true,
      count: reviews.length,
      reviews,
    };
  }

  async getReviewsForProvider(providerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { providerId, isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { fullName: true, profilePhoto: true } },
        vehicle: { select: { brand: true, model: true } },
      },
    });

    return {
      success: true,
      count: reviews.length,
      reviews,
    };
  }
}
