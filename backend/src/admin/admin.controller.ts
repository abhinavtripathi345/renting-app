import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin Administration')
@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get marketplace overview KPIs & metrics' })
  async getMetrics() {
    return this.adminService.getPlatformMetrics();
  }

  @Get('users')
  @ApiOperation({ summary: 'List all platform users with verification status' })
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/verify')
  @ApiOperation({ summary: 'Approve or reject customer verification documents' })
  async verifyUser(
    @Param('id') userId: string,
    @Body('status') status: 'VERIFIED' | 'REJECTED',
    @Body('note') note?: string,
  ) {
    return this.adminService.verifyUser(userId, status, note);
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend or unsuspend user account' })
  async toggleSuspendUser(
    @Param('id') userId: string,
    @Body('isSuspended') isSuspended: boolean,
  ) {
    return this.adminService.toggleSuspendUser(userId, isSuspended);
  }

  @Get('providers')
  @ApiOperation({ summary: 'List all providers (agencies & individual owners)' })
  async getProviders() {
    return this.adminService.getProviders();
  }

  @Patch('providers/:id/verify')
  @ApiOperation({ summary: 'Verify or reject provider profile' })
  async verifyProvider(
    @Param('id') providerId: string,
    @Body('status') status: 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW',
  ) {
    return this.adminService.verifyProvider(providerId, status);
  }

  @Patch('providers/:id/assisted-onboarding')
  @ApiOperation({ summary: 'Mark provider as having been onboarded via Assisted Onboarding' })
  async markAssistedOnboarding(
    @Param('id') providerId: string,
    @Body('representativeId') representativeId?: string,
  ) {
    return this.adminService.markAssistedOnboarding(providerId, representativeId);
  }

  @Get('vehicles')
  @ApiOperation({ summary: 'List all vehicles across providers for moderation' })
  async getVehicles() {
    return this.adminService.getVehicles();
  }

  @Patch('vehicles/:id/approve')
  @ApiOperation({ summary: 'Approve or reject vehicle listing' })
  async approveVehicle(
    @Param('id') vehicleId: string,
    @Body('isApproved') isApproved: boolean,
  ) {
    return this.adminService.approveVehicle(vehicleId, isApproved);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Master view of all bookings on the platform' })
  async getBookingsMaster() {
    return this.adminService.getBookingsMaster();
  }
}
