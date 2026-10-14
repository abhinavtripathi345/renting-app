import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

// In-memory OTP storage for demo/development OTP architecture
// Extensible to Redis / SMS Gateway (Twilio/AWS SNS/Gupshup)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone } = dto;
    // Development OTP: default to 123456 or generated 6 digits
    const otp = '123456';
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    otpStore.set(phone, { otp, expiresAt });

    return {
      success: true,
      message: `OTP sent successfully to ${phone}. (Use mock OTP: 123456 in dev/demo mode)`,
      phone,
      devOtp: '123456',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, otp, fullName, role } = dto;

    const storedOtp = otpStore.get(phone);
    const isValidOtp = (storedOtp && storedOtp.otp === otp && Date.now() <= storedOtp.expiresAt) || otp === '123456';

    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP. Please use 123456 for testing.');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone },
      include: { providerProfile: true },
    });

    if (!user) {
      const userRole = role || 'CUSTOMER';
      user = await this.prisma.user.create({
        data: {
          phone,
          fullName: fullName || (userRole === 'PROVIDER' ? 'Rental Partner' : 'Renting App Rider'),
          role: userRole,
          verificationStatus: 'UNVERIFIED',
        },
        include: { providerProfile: true },
      });
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Your account has been suspended by administration');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.phone, user.role);

    return {
      success: true,
      user,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'renting_app_super_secret_refresh_jwt_key_2026',
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { providerProfile: true },
      });
      if (!user || user.isSuspended) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.generateTokens(user.id, user.phone, user.role);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async quickLoginAs(role: 'ADMIN' | 'CUSTOMER_VERIFIED' | 'CUSTOMER_PENDING' | 'AGENCY' | 'OWNER') {
    let phone = '+919876543210';
    if (role === 'ADMIN') phone = '+919876500000';
    if (role === 'CUSTOMER_VERIFIED') phone = '+919876543210';
    if (role === 'CUSTOMER_PENDING') phone = '+919876543211';
    if (role === 'AGENCY') phone = '+919876511111';
    if (role === 'OWNER') phone = '+919876544444';

    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: { providerProfile: true },
    });

    if (!user) {
      throw new BadRequestException(`Seed user for role ${role} not found. Please run seed script.`);
    }

    const tokens = this.generateTokens(user.id, user.phone, user.role);
    return {
      success: true,
      user,
      ...tokens,
    };
  }

  private generateTokens(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'renting_app_super_secret_jwt_key_2026_change_in_production',
      expiresIn: '7d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'renting_app_super_secret_refresh_jwt_key_2026',
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: '7d',
    };
  }
}
