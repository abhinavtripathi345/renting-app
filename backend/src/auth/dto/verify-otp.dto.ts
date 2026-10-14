import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123456', description: 'OTP code (Use 123456 in dev/sandbox mode)' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiPropertyOptional({ example: 'Aarav Verma' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'CUSTOMER', enum: ['CUSTOMER', 'PROVIDER', 'ADMIN'] })
  @IsString()
  @IsOptional()
  role?: string;
}
