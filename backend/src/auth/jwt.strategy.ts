import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'renting_app_super_secret_jwt_key_2026_change_in_production',
    });
  }

  async validate(payload: { sub: string; phone: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { providerProfile: true },
    });
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    if (user.isSuspended) {
      throw new UnauthorizedException('User account has been suspended');
    }
    return user;
  }
}
