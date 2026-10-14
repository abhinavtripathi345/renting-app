import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConditionReportsService } from './condition-reports.service';
import { CreateConditionReportDto } from './dto/condition-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Condition Reports (Handover & Return Evidence)')
@Controller('api/condition-reports')
export class ConditionReportsController {
  constructor(private readonly conditionReportsService: ConditionReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record Before or After rental condition report (odometer, fuel, photos)' })
  async createReport(@CurrentUser('id') userId: string, @Body() dto: CreateConditionReportDto) {
    return this.conditionReportsService.createConditionReport(userId, dto);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get condition reports recorded for a specific booking' })
  async getReportsByBooking(@Param('bookingId') bookingId: string) {
    return this.conditionReportsService.getReportsByBooking(bookingId);
  }
}
