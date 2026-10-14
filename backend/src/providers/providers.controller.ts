import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { RegisterProviderDto, UpdateProviderDto } from './dto/provider.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Providers')
@Controller('api/providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a Rental Agency or Individual Owner' })
  async register(@CurrentUser('id') userId: string, @Body() dto: RegisterProviderDto) {
    return this.providersService.registerProvider(userId, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in provider profile & vehicles' })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.providersService.getMyProviderProfile(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider profile information' })
  async updateMyProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProviderDto) {
    return this.providersService.updateProviderProfile(userId, dto);
  }

  @Get('dashboard-stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider dashboard overview & metrics' })
  async getDashboardStats(@CurrentUser('id') userId: string) {
    return this.providersService.getDashboardStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public provider details and available vehicle fleet' })
  async getProviderById(@Param('id') id: string) {
    return this.providersService.getProviderById(id);
  }
}
