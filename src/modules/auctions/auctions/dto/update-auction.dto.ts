import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateAuctionDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Antique Vase',
    description: 'Updated title of the auction item',
    required: false,
  })
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'An exquisite antique vase from the Ming dynasty.',
    description: 'Updated description of the auction item',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 150.0,
    description: 'Updated starting price of the auction item',
    required: false,
  })
  startPrice?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 150.0,
    description: 'Updated current price of the auction item',
    required: false,
  })
  currentPrice?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Updated start time of the auction',
    required: false,
  })
  startTime?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2024-03-01T00:00:00.000Z',
    description: 'Updated end time of the auction',
    required: false,
  })
  endTime?: string;

  @IsOptional()
  @ApiProperty({
    example: 'http://example.com/updatedimage.jpg',
    description: 'Updated URL of the image of the auction item',
    required: false,
  })
  imageUrl?: string;
}
