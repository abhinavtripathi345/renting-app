import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, SubmitVerificationDto } from './dto/users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users & Verification')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile and verification status' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update personal profile details' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Upload reusable one-time customer verification documents (DL / Aadhaar)' })
  async submitDocuments(@CurrentUser('id') userId: string, @Body() dto: SubmitVerificationDto) {
    return this.usersService.submitVerificationDocuments(userId, dto);
  }

  @Get('verification-status')
  @ApiOperation({ summary: 'Check customer one-time verification status' })
  async getVerificationStatus(@CurrentUser('id') userId: string) {
    return this.usersService.getVerificationStatus(userId);
  }
}
