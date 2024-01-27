import { Prisma, Role } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  first_name: string;

  last_name: string;

  avatar: string;

  password: string;

  email: string;

  role: Role;

  createdAt: Date;
}
