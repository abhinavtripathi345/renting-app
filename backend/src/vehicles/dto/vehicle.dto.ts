import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Royal Enfield' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Bullet 350' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiPropertyOptional({ example: 'Standard BS6' })
  @IsString()
  @IsOptional()
  variant?: string;

  @ApiProperty({ example: 'BIKE', enum: ['BIKE', 'SCOOTER', 'ELECTRIC_VEHICLE', 'CAR'] })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsNumber()
  @IsOptional()
  modelYear?: number;

  @ApiProperty({ example: 'CH-01-CK-3450' })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiPropertyOptional({ example: 'Pristine Royal Enfield Bullet 350 with classic exhaust thump.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 60.0 })
  @IsNumber()
  @IsOptional()
  pricePerHour?: number;

  @ApiProperty({ example: 750.0 })
  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @ApiPropertyOptional({ example: 4500.0 })
  @IsNumber()
  @IsOptional()
  pricePerWeek?: number;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0)
  securityDeposit: number;

  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @IsOptional()
  minRentalHours?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsNumber()
  @IsOptional()
  mileageLimitKmPerDay?: number;

  @ApiPropertyOptional({ example: 5.0 })
  @IsNumber()
  @IsOptional()
  excessKmCharge?: number;

  @ApiPropertyOptional({ example: 'SAME_TO_SAME' })
  @IsString()
  @IsOptional()
  fuelPolicy?: string;

  @ApiProperty({ example: 'SCO 45-46, Sector 17-C, Chandigarh' })
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @ApiPropertyOptional({ example: 30.7398 })
  @IsNumber()
  @IsOptional()
  pickupLatitude?: number;

  @ApiPropertyOptional({ example: 76.7827 })
  @IsNumber()
  @IsOptional()
  pickupLongitude?: number;

  @ApiPropertyOptional({ example: 'Chandigarh' })
  @IsString()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({ example: 'Sector 17' })
  @IsString()
  @IsOptional()
  areaId?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'],
  })
  @IsArray()
  @IsOptional()
  imageUrls?: string[];
}

export class UpdateVehicleDto extends CreateVehicleDto {
  @ApiPropertyOptional({ example: 'AVAILABLE', enum: ['AVAILABLE', 'BOOKED', 'RESERVED', 'MAINTENANCE', 'INACTIVE'] })
  @IsString()
  @IsOptional()
  status?: string;
}

export class SearchVehiclesQueryDto {
  @ApiPropertyOptional({ example: 'Chandigarh' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'BIKE', enum: ['BIKE', 'SCOOTER', 'ELECTRIC_VEHICLE', 'CAR'] })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'Bullet' })
  @IsString()
  @IsOptional()
  searchQuery?: string;

  @ApiPropertyOptional({ example: '2026-09-01T10:00:00.000Z' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-09-03T10:00:00.000Z' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 300 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ example: 2000 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 'AGENCY', enum: ['AGENCY', 'INDIVIDUAL'] })
  @IsString()
  @IsOptional()
  providerType?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsString()
  @IsOptional()
  verifiedOnly?: string;

  @ApiPropertyOptional({ example: 'best_value', enum: ['price_asc', 'price_desc', 'rating_desc', 'best_value'] })
  @IsString()
  @IsOptional()
  sortBy?: string;
}
