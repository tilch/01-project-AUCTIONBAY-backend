import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt')) // Ensure this matches the name you've given your JWT strategy
  @Post('/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiOkResponse({ description: 'Password successfully changed' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async changePassword(
    @Req() request: any, // Use `any` to access custom properties, or better, define a custom Request interface
    @Res() response: Response,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<any> {
    try {
      // Assuming `request.user.email` contains the email from JWT token
      const userEmail = request.user.email;

      // Call the service to change the password
      await this.authService.changePassword(
        userEmail,
        body.oldPassword,
        body.newPassword,
      );

      // If successful, return an OK response
      return response.status(HttpStatus.OK).json({
        status: 'Success',
        message: 'Password successfully changed',
      });
    } catch (error) {
      // Handle errors appropriately
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error.message,
      });
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
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
  @ApiOperation({ summary: 'User registration' })
  @ApiOkResponse({ description: 'User successfully registered' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDto: RegisterUserDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully registered user!',
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
