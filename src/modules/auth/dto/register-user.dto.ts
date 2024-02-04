import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'yourPassword123#',
    description: 'Password for the user',
  })
  password: string;

  @IsString()
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  first_name: string;

  @IsString()
  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  last_name: string;
}
