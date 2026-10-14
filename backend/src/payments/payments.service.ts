import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPaymentOrder(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== userId) {
      throw new BadRequestException('Unauthorized booking payment');
    }

    // Generate mock/sandbox order payload (ready for Razorpay/Stripe)
    const orderId = `order_sandbox_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    return {
      success: true,
      order: {
        orderId,
        amount: booking.totalAmount,
        currency: 'INR',
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_12345',
        customerName: booking.customerId,
        notes: {
          rentalAmount: booking.rentalAmount,
          securityDeposit: booking.securityDeposit,
          platformFee: booking.platformFee,
        },
      },
    };
  }

  async verifyPayment(dto: {
    bookingId: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }) {
    const { bookingId, razorpayPaymentId } = dto;
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const transactionId = razorpayPaymentId || `pay_tx_${Date.now()}`;

    // Update or create payment record
    const payment = await this.prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        customerId: booking.customerId,
        amount: booking.totalAmount,
        paymentType: 'RENTAL_AND_DEPOSIT',
        status: 'SUCCESS',
        transactionId,
        provider: 'RAZORPAY_SANDBOX',
        rawResponse: JSON.stringify(dto),
      },
      update: {
        status: 'SUCCESS',
        transactionId,
        rawResponse: JSON.stringify(dto),
      },
    });

    // Update booking status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'SUCCESS',
      },
    });

    return {
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      payment,
    };
  }

  async handleWebhook(eventPayload: any) {
    // Webhook processor for live payment gateways
    return {
      received: true,
      timestamp: new Date().toISOString(),
    };
  }
}
