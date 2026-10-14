import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculatePriceDto {
  @ApiProperty({ example: 'vehicle-uuid-here' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: '2026-09-01T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-09-03T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}

export class CreateBookingDto {
  @ApiProperty({ example: 'vehicle-uuid-here' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: '2026-09-01T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-09-03T10:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ example: 'ONLINE', enum: ['ONLINE', 'ONSITE'] })
  @IsString()
  @IsOptional()
  bookingSource?: 'ONLINE' | 'ONSITE';

  @ApiPropertyOptional({ example: 'Digital signed by Aarav Verma' })
  @IsString()
  @IsOptional()
  customerSignatureNotes?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'ACTIVE',
    enum: ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED', 'DISPUTED'],
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 'Customer requested early return' })
  @IsString()
  @IsOptional()
  notes?: string;
}
