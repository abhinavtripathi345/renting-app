import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Aarav Verma' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'aarav.verma@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'House 412, Sector 22-B, Chandigarh' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '1996-05-12' })
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/profile.jpg' })
  @IsString()
  @IsOptional()
  profilePhoto?: string;
}

export class SubmitVerificationDto {
  @ApiPropertyOptional({ example: 'CH-01-2021-0098472' })
  @IsString()
  @IsOptional()
  drivingLicenseNo?: string;

  @ApiPropertyOptional({ example: '2035-10-15' })
  @IsString()
  @IsOptional()
  dlExpiryDate?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/dl-front.jpg' })
  @IsString()
  @IsOptional()
  dlFrontUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/dl-back.jpg' })
  @IsString()
  @IsOptional()
  dlBackUrl?: string;

  @ApiPropertyOptional({ example: 'XXXXXXXX9876' })
  @IsString()
  @IsOptional()
  aadhaarNo?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/aadhaar.jpg' })
  @IsString()
  @IsOptional()
  aadhaarDocUrl?: string;
}
