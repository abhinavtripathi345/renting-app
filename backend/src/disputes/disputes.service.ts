import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto, RespondDisputeDto, ResolveDisputeDto } from './dto/dispute.dto';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async createDispute(userId: string, dto: CreateDisputeDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        bookingId: dto.bookingId,
        initiatedByUserId: userId,
        title: dto.title,
        description: dto.description,
        claimAmount: dto.claimAmount || 0.0,
        evidencePhotosJson: JSON.stringify(dto.evidencePhotos || []),
        status: 'OPEN',
      },
      include: {
        initiatedByUser: { select: { fullName: true, phone: true } },
        booking: { include: { vehicle: true, provider: true } },
      },
    });

    // Update booking status to DISPUTED
    await this.prisma.booking.update({
      where: { id: dto.bookingId },
      data: { status: 'DISPUTED' },
    });

    return {
      success: true,
      message: 'Dispute ticket created successfully and submitted for review',
      dispute,
    };
  }

  async getDisputes(userId: string, role: string) {
    const where: any = {};
    if (role === 'CUSTOMER') {
      where.initiatedByUserId = userId;
    } else if (role === 'PROVIDER') {
      const provider = await this.prisma.provider.findUnique({ where: { userId } });
      if (provider) {
        where.booking = { providerId: provider.id };
      }
    }

    const disputes = await this.prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        initiatedByUser: { select: { fullName: true, phone: true, email: true } },
        booking: {
          include: {
            vehicle: true,
            provider: true,
            conditionReports: true,
          },
        },
      },
    });

    return {
      success: true,
      count: disputes.length,
      disputes: disputes.map((d) => ({
        ...d,
        evidencePhotos: JSON.parse(d.evidencePhotosJson || '[]'),
      })),
    };
  }

  async getDisputeById(id: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        initiatedByUser: { select: { fullName: true, phone: true, email: true } },
        booking: {
          include: {
            vehicle: { include: { images: true } },
            provider: true,
            customer: { select: { fullName: true, phone: true, email: true } },
            conditionReports: { include: { recordedByUser: true } },
            payment: true,
          },
        },
      },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return {
      success: true,
      dispute: {
        ...dispute,
        evidencePhotos: JSON.parse(dispute.evidencePhotosJson || '[]'),
      },
    };
  }

  async respondToDispute(userId: string, disputeId: string, dto: RespondDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { booking: true },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    if (!provider || dispute.booking.providerId !== provider.id) {
      throw new ForbiddenException('Only the associated provider can submit a response');
    }

    const updated = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        providerResponse: dto.providerResponse,
        status: 'UNDER_REVIEW',
      },
    });

    return {
      success: true,
      message: 'Provider response submitted successfully',
      dispute: updated,
    };
  }

  async resolveDispute(disputeId: string, dto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { booking: true },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    const updated = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: dto.status,
        resolutionNotes: dto.resolutionNotes,
        resolvedAt: new Date(),
      },
    });

    if (dto.status === 'RESOLVED') {
      await this.prisma.booking.update({
        where: { id: dispute.bookingId },
        data: { status: 'COMPLETED' },
      });
    }

    return {
      success: true,
      message: `Dispute status marked as ${dto.status}`,
      dispute: updated,
    };
  }
}
