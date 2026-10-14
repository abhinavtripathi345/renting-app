import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConditionReportDto {
  @ApiProperty({ example: 'booking-uuid-here' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 'BEFORE_RENTAL', enum: ['BEFORE_RENTAL', 'AFTER_RENTAL'] })
  @IsString()
  @IsNotEmpty()
  reportType: 'BEFORE_RENTAL' | 'AFTER_RENTAL';

  @ApiProperty({ example: 12450.0, description: 'Odometer reading in kilometers' })
  @IsNumber()
  @IsNotEmpty()
  odometerReading: number;

  @ApiProperty({ example: 95.0, description: 'Fuel level percentage (0 to 100)' })
  @IsNumber()
  @IsNotEmpty()
  fuelLevelPercent: number;

  @ApiPropertyOptional({ example: 'Minor pre-existing scratch on rear silencer guard' })
  @IsString()
  @IsOptional()
  damageNotes?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'],
  })
  @IsArray()
  @IsOptional()
  photos?: string[];
}
