import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+919876543210', description: 'Customer or Provider Phone Number' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
