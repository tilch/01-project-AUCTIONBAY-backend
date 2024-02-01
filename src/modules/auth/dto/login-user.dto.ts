import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @Length(5, 40)
  @ApiProperty({
    example: 'john_doe',
    description: 'Username for the user',
    minLength: 5,
    maxLength: 40,
  })
  username: string;

  @IsString()
  @Length(5, 40)
  @ApiProperty({
    example: 'yourPassword123#',
    description: 'Password for the user',
    minLength: 5,
    maxLength: 40,
  })
  password: string;
}
