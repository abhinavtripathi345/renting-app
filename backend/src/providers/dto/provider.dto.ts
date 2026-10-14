import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterProviderDto {
  @ApiProperty({ example: 'AGENCY', enum: ['AGENCY', 'INDIVIDUAL'] })
  @IsString()
  @IsNotEmpty()
  providerType: 'AGENCY' | 'INDIVIDUAL';

  @ApiProperty({ example: 'Chandigarh Bike Rentals' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiPropertyOptional({ example: 'SCO 45-46, Sector 17-C, Chandigarh' })
  @IsString()
  @IsOptional()
  businessAddress?: string;

  @ApiPropertyOptional({ example: '04AABCC1234D1Z5' })
  @IsString()
  @IsOptional()
  gstNumber?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/doc-proof.jpg' })
  @IsString()
  @IsOptional()
  idProofUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/trade-license.jpg' })
  @IsString()
  @IsOptional()
  businessDocUrl?: string;

  @ApiPropertyOptional({ example: 'Chandigarh' })
  @IsString()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({ example: 'SELF_SERVICE', enum: ['SELF_SERVICE', 'ASSISTED'] })
  @IsString()
  @IsOptional()
  onboardingType?: 'SELF_SERVICE' | 'ASSISTED';
}

export class UpdateProviderDto {
  @ApiPropertyOptional({ example: 'Chandigarh Bike Rentals & Tours' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({ example: 'SCO 45-46, Sector 17-C, Chandigarh' })
  @IsString()
  @IsOptional()
  businessAddress?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/doc-proof.jpg' })
  @IsString()
  @IsOptional()
  idProofUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/trade-license.jpg' })
  @IsString()
  @IsOptional()
  businessDocUrl?: string;
}
