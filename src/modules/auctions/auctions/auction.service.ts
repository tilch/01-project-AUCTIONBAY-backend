import {
  BadRequestException,
  Body,
  Injectable,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Auction } from '../../../entities/auction.model';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async createAuction(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    try {
      return this.prisma.auction.create({ data: createAuctionDto });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while creating a new auction',
      );
    }
  }

  async updateAuction(
    id: string,
    username: string,
    updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction | null> {
    const auctionId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || auction.userId !== user.id) {
      throw new UnauthorizedException('You can only update your own auctions.');
    }
    return this.prisma.auction.update({
      where: { id: auctionId },
      data: updateAuctionDto,
    });
  }

  async deleteAuction(id: number, username: string): Promise<Auction | null> {
    const auctionId = parseInt(String(id), 10);
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction || auction.userId !== user.id) {
      throw new UnauthorizedException('You can only delete your own auctions.');
    }
    return this.prisma.auction.delete({ where: { id: auctionId } });
  }

  async findAllAuctionsByUser(userId: string): Promise<Auction[]> {
    return this.prisma.auction.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findAllAuctions(): Promise<Auction[]> {
    return this.prisma.auction.findMany();
  }

  async findAuctionById(id: number): Promise<Auction | null> {
    // Convert `id` to an integer if it's not already
    const auctionId = parseInt(String(id), 10);
    return this.prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
    });
  }
}
