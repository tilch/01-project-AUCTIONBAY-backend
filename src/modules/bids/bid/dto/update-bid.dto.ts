import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBidDto {
  @ApiProperty({
    required: true,
    example: '12.56',
    description: 'Amount, in float.',
  })
  @IsNotEmpty()
  amount: number;
}
