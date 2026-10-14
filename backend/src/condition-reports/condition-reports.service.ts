import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConditionReportDto } from './dto/condition-report.dto';

@Injectable()
export class ConditionReportsService {
  constructor(private prisma: PrismaService) {}

  async createConditionReport(userId: string, dto: CreateConditionReportDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const report = await this.prisma.conditionReport.create({
      data: {
        bookingId: dto.bookingId,
        reportType: dto.reportType,
        odometerReading: dto.odometerReading,
        fuelLevelPercent: dto.fuelLevelPercent,
        damageNotes: dto.damageNotes,
        photosJson: JSON.stringify(dto.photos || []),
        recordedByUserId: userId,
      },
      include: {
        recordedByUser: { select: { fullName: true, role: true } },
      },
    });

    return {
      success: true,
      message: `${dto.reportType === 'BEFORE_RENTAL' ? 'Pre-rental' : 'Post-rental'} condition report recorded successfully`,
      report,
    };
  }

  async getReportsByBooking(bookingId: string) {
    const reports = await this.prisma.conditionReport.findMany({
      where: { bookingId },
      orderBy: { recordedAt: 'asc' },
      include: {
        recordedByUser: { select: { fullName: true, role: true } },
      },
    });

    const parsedReports = reports.map((r) => ({
      ...r,
      photos: JSON.parse(r.photosJson || '[]'),
    }));

    return {
      success: true,
      count: parsedReports.length,
      reports: parsedReports,
    };
  }
}
