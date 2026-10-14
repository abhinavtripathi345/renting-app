import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'booking-uuid-here' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 4.8, description: 'Vehicle rating between 1.0 and 5.0' })
  @IsNumber()
  @Min(1)
  @Max(5)
  vehicleRating: number;

  @ApiProperty({ example: 5.0, description: 'Provider / Agency rating between 1.0 and 5.0' })
  @IsNumber()
  @Min(1)
  @Max(5)
  providerRating: number;

  @ApiProperty({ example: 'Great bike condition, smooth throttle and prompt provider service!' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
