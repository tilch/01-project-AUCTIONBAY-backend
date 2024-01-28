import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('login / signup')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully logged in!',
        result: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Error!',
        message: 'Internal server error!',
      });
    }
  }

  @Post('/signup')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDto: RegisterUserDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully register user!',
        result: result,
      });
    } catch (err) {
      console.log(err);
      return response.status(500).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }
}
