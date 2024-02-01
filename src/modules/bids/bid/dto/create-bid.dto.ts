import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBidDto {
  @ApiProperty({
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    required: true,
    example: '3',
    description: 'Auction ID',
  })
  @IsNotEmpty()
  auctionId: number;

  @ApiProperty({
    required: true,
    example: '8.99',
    description: 'Amount of money, in float.',
  })
  @IsNotEmpty()
  amount: number;
}
