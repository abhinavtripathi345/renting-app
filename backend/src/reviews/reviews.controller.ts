import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews & Ratings')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit dual review (vehicleRating & providerRating) for completed booking' })
  async createReview(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(userId, dto);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get verified reviews for a specific vehicle' })
  async getReviewsForVehicle(@Param('vehicleId') vehicleId: string) {
    return this.reviewsService.getReviewsForVehicle(vehicleId);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: 'Get verified reviews for a specific provider' })
  async getReviewsForProvider(@Param('providerId') providerId: string) {
    return this.reviewsService.getReviewsForProvider(providerId);
  }
}
