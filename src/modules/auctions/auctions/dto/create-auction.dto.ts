import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({
    example: 'Vintage Camera',
    description: 'Title of the auction item',
  })
  title: string;

  @ApiProperty({
    example: 'A rare vintage camera in excellent condition.',
    description: 'Description of the auction item',
  })
  description: string;

  @ApiProperty({
    example: 100.0,
    description: 'Starting price of the auction item',
  })
  startPrice: number;

  @ApiProperty({
    example: 100.0,
    description: 'Current price of the auction item',
  })
  currentPrice: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start time of the auction',
  })
  startTime: Date;

  @ApiProperty({
    example: '2024-02-01T00:00:00.000Z',
    description: 'End time of the auction',
  })
  endTime: Date;

  @ApiProperty({
    description: 'URL of the image of the auction item',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID of the auction creator',
  })
  userId: string;
}
