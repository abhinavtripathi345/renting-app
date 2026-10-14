import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgreementsService } from './agreements.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Digital Rental Agreements')
@Controller('api/agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get digital rental agreement for a booking' })
  async getAgreement(@Param('bookingId') bookingId: string) {
    return this.agreementsService.getAgreementByBooking(bookingId);
  }

  @Post('sign/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign / digitally accept rental agreement' })
  async signAgreement(
    @Param('bookingId') bookingId: string,
    @Body('signatureNotes') signatureNotes: string,
  ) {
    return this.agreementsService.signAgreement(bookingId, signatureNotes);
  }
}
