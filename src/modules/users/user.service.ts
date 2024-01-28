import { PrismaService } from '../../prisma.service';
import { User } from '../../entities/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: String(id) } });
  }

  async createUser(data: User): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with that email already exists.');
    }
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

  async updateUser(id: string, data: User): Promise<User> {
    const updatedData: any = {
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      avatar: data.avatar,
    };

    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id: String(id) },
      data: updatedData,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id: String(id) },
    });
  }
}
