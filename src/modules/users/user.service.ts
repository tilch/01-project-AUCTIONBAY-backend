import { PrismaService } from '../../prisma.service';
import { User } from './user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async getUser(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async createUser(data: User): Promise<User> {
    // Check if a user with the same email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with that email already exists.');
    }

    // Create a new user
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while creating a new user',
      );
    }
  }

  async updateUser(id: number, data: User): Promise<User> {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        email: data.email,
        avatar: data.avatar,
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}
