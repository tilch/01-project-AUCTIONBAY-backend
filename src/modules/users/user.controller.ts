import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.model';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Get all users' })
  // @ApiOkResponse({ description: 'Successfully fetched list of users.' })
  // @ApiBadRequestResponse({ description: 'Bad Request' })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // async getAllUsers(): Promise<User[] | any> {
  //   return this.userService.getAllUsers();
  // }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user information' })
  @ApiOkResponse({ description: 'Successfully fetched user data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMe(@Req() req: any): Promise<UserDto> {
    const email = req.user.email;
    return this.userService.getMe(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'Successfully fetched user data.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({ description: 'User successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async deleteUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.deleteUser(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ description: 'User successfully updated.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    @Body() postData: User,
  ): Promise<any> {
    return this.userService.updateUser(id, postData);
  }
}
