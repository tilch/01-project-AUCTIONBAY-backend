import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { Request, Response } from 'express';
import { Product } from '@prisma/client';
import { ProductsService } from './products.service';
import { User } from '../../../entities/user.model';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({ description: 'List all products' })
  @ApiBadRequestResponse({ description: 'Error for list of users.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllProducts(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Product[] | any> {
    try {
      const result = await this.productsService.getAllProducts();
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully fetch data!',
        result: result,
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Internal Server error!',
      });
    }
  }

  @Get('id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.getProduct(id);
  }
}
