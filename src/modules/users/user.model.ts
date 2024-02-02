import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  last_name: string;

  @ApiProperty({
    example: 'http://example.com/avatar.jpg',
    description: "URL of the user's avatar image",
    required: false,
  })
  avatar: string;

  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  username: string;

  @ApiProperty({
    example: 'yourSecurePassword',
    description: 'Password for the user account',
  })
  password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Date when the user account was created',
  })
  createdAt: Date;
}
