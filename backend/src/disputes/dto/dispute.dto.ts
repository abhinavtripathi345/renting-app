import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDisputeDto {
  @ApiProperty({ example: 'booking-uuid-here' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 'Disputed scratch claim on scooter front fender' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Provider claimed ₹400 for a pre-existing scratch documented in handover report.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 400.0 })
  @IsNumber()
  @IsOptional()
  claimAmount?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800'],
  })
  @IsArray()
  @IsOptional()
  evidencePhotos?: string[];
}

export class RespondDisputeDto {
  @ApiProperty({ example: 'We verified the pickup photos and agree to waive the charge.' })
  @IsString()
  @IsNotEmpty()
  providerResponse: string;
}

export class ResolveDisputeDto {
  @ApiProperty({ example: 'RESOLVED', enum: ['RESOLVED', 'REJECTED', 'UNDER_REVIEW'] })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'Pre-existing condition report verified. Deposit refund ordered to customer.' })
  @IsString()
  @IsNotEmpty()
  resolutionNotes: string;
}
