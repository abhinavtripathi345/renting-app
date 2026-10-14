import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments & Checkout')
@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment gateway order / sandbox checkout' })
  async createOrder(
    @CurrentUser('id') userId: string,
    @Body('bookingId') bookingId: string,
  ) {
    return this.paymentsService.createPaymentOrder(bookingId, userId);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify payment signature from payment gateway' })
  async verifyPayment(@Body() body: any) {
    return this.paymentsService.verifyPayment(body);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook endpoint for payment gateway events' })
  async handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
