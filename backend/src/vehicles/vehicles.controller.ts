import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, SearchVehiclesQueryDto } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Vehicles & Discovery')
@Controller('api/vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter vehicles with Best Value scoring & multi-provider aggregation' })
  async searchVehicles(@Query() query: SearchVehiclesQueryDto) {
    return this.vehiclesService.searchVehicles(query);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Side-by-side comparison of 2 or more selected vehicles' })
  @ApiQuery({ name: 'ids', example: 'id1,id2,id3', description: 'Comma-separated vehicle IDs' })
  async compareVehicles(@Query('ids') ids: string) {
    const vehicleIds = ids ? ids.split(',').map((id) => id.trim()).filter(Boolean) : [];
    return this.vehiclesService.compareVehicles(vehicleIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complete details of a vehicle listing' })
  async getVehicleById(@Param('id') id: string) {
    return this.vehiclesService.getVehicleById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vehicle listing (Provider / Admin only)' })
  async createVehicle(@CurrentUser('id') userId: string, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vehicle listing (Provider / Admin only)' })
  async updateVehicle(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicle(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate vehicle listing (Provider / Admin only)' })
  async deleteVehicle(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.vehiclesService.deleteVehicle(userId, id);
  }
}
