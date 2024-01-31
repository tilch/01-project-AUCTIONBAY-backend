import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../entities/user.model';
import { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiCreatedResponse({ description: 'List all users.' })
  // @ApiBadRequestResponse({ description: 'Error for list of users.' })
  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getAllUsers(
  //   @Req() request: Request,
  //   @Res() response: Response,
  // ): Promise<User[] | any> {
  //   try {
  //     const result = await this.userService.getAllUsers();
  //     return response.status(200).json({
  //       status: 'Ok!',
  //       message: 'Successfully fetch data!',
  //       result: result,
  //     });
  //   } catch (error) {
  //     return response.status(500).json({
  //       message: 'Internal Server error!',
  //     });
  //   }
  // }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiTags('/me')
  async getMe(@Req() req: any): Promise<UserDto> {
    const username = req.user.username;
    return this.userService.getMe(username);
  }

  @Get('id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Delete()
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() postData: User,
  ): Promise<any> {
    try {
      await this.userService.updateUser(id, postData);
      return {
        status: 'Ok!',
        message: 'Changes successfully made!',
      };
    } catch (error) {
      return {
        status: 'Error!',
        message: 'Failed to update user.',
      };
    }
  }
}
