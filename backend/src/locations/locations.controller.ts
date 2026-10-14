import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations (Cities & Hubs)')
@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get active rental cities and coverage metrics' })
  async getCities() {
    return this.locationsService.getCities();
  }

  @Get('cities/:id/areas')
  @ApiOperation({ summary: 'Get strategic pickup hubs/areas for a city' })
  async getAreasByCity(@Param('id') id: string) {
    return this.locationsService.getAreasByCity(id);
  }
}
