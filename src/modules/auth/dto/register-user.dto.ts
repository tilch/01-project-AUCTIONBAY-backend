import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
