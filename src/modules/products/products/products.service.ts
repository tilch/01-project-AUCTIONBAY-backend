import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { User } from '../../../entities/user.model';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProduct(id: string): Promise<Product> {
    return this.prisma.product.findUnique({ where: { id: String(id) } });
  }
}
