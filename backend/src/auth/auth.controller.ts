import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to phone number (Dev OTP: 123456)' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and receive JWT access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh expired JWT access token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('dev-quick-login')
  @ApiOperation({ summary: 'Instant login switch for demo/testing (ADMIN, CUSTOMER_VERIFIED, CUSTOMER_PENDING, AGENCY, OWNER)' })
  async quickLogin(@Body('role') role: 'ADMIN' | 'CUSTOMER_VERIFIED' | 'CUSTOMER_PENDING' | 'AGENCY' | 'OWNER') {
    return this.authService.quickLoginAs(role || 'CUSTOMER_VERIFIED');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getMe(@CurrentUser() user: any) {
    return { success: true, user };
  }
}
