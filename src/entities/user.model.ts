import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  first_name: string;

  last_name: string;

  avatar: string;

  username: string;

  password: string;

  email: string;

  createdAt: Date;
}
