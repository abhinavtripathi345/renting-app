import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgreementsService {
  constructor(private prisma: PrismaService) {}

  async getAgreementByBooking(bookingId: string) {
    const agreement = await this.prisma.rentalAgreement.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            vehicle: true,
            provider: true,
            customer: { select: { fullName: true, phone: true, email: true } },
          },
        },
      },
    });

    if (!agreement) {
      throw new NotFoundException('Digital rental agreement not found for this booking');
    }

    return {
      success: true,
      agreement,
    };
  }

  async signAgreement(bookingId: string, signatureNotes: string) {
    const agreement = await this.prisma.rentalAgreement.update({
      where: { bookingId },
      data: {
        signedAtCustomer: new Date(),
        signatureCustomerUrl: signatureNotes || 'Digitally signed and accepted',
        digitalSignatureHash: `sha256_${Date.now()}_signed`,
      },
    });

    return {
      success: true,
      message: 'Rental agreement signed successfully',
      agreement,
    };
  }
}
