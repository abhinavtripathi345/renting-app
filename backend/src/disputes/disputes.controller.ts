import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto, RespondDisputeDto, ResolveDisputeDto } from './dto/dispute.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Disputes & Claims')
@Controller('api/disputes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Create dispute ticket for a rental booking' })
  async createDispute(@CurrentUser('id') userId: string, @Body() dto: CreateDisputeDto) {
    return this.disputesService.createDispute(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List disputes relevant to user role' })
  async getDisputes(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.disputesService.getDisputes(userId, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispute details, evidence, and booking reports' })
  async getDisputeById(@Param('id') id: string) {
    return this.disputesService.getDisputeById(id);
  }

  @Patch(':id/respond')
  @UseGuards(RolesGuard)
  @Roles('PROVIDER', 'ADMIN')
  @ApiOperation({ summary: 'Provider response / counter-evidence to dispute' })
  async respond(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: RespondDisputeDto,
  ) {
    return this.disputesService.respondToDispute(userId, id, dto);
  }

  @Patch(':id/resolve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin resolution of dispute' })
  async resolve(
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveDispute(id, dto);
  }
}
