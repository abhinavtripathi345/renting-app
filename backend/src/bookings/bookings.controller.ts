import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CalculatePriceDto, CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('calculate-price')
  @ApiOperation({ summary: 'Calculate transparent price breakdown and check date availability' })
  async calculatePrice(@Body() dto: CalculatePriceDto) {
    return this.bookingsService.calculatePrice(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vehicle rental booking (with server-side conflict check)' })
  async createBooking(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List bookings for current authenticated Customer, Provider, or Admin' })
  @ApiQuery({ name: 'status', required: false, enum: ['ALL', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'] })
  async getBookings(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Query('status') status?: string,
  ) {
    return this.bookingsService.getBookings(userId, role, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full details of a specific booking' })
  async getBookingById(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Param('id') id: string,
  ) {
    return this.bookingsService.getBookingById(userId, role, id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status (Handover, Return, Cancel, etc.)' })
  async updateStatus(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(userId, role, id, dto);
  }
}
