import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @Length(5, 40)
  @ApiProperty({
    example: 'example@example.com',
    description: 'Email for the user',
    minLength: 5,
    maxLength: 40,
  })
  oldPassword: string;

  @IsString()
  @Length(5, 40)
  @ApiProperty({
    example: 'yourPassword123#',
    description: 'Password for the user',
    minLength: 5,
    maxLength: 40,
  })
  newPassword: string;
}
