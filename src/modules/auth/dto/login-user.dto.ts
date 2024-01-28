import { IsString, isString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(5, 40)
  username: string;

  @IsString()
  @Length(5, 40)
  password: string;
}
