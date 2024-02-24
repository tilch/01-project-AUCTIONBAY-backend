import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Auction } from '../../../entities/auction.model';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { diskStorage } from 'multer';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async createAuction(
    createAuctionDto: CreateAuctionDto,
    imagePath: string,
  ): Promise<Auction> {
    const startPrice = parseFloat(String(createAuctionDto.startPrice));

    try {
      const auctionData = {
        ...createAuctionDto,
        startPrice: startPrice, // Use the converted float value
        imageUrl: imagePath,
      };

      return this.prisma.auction.create({ data: auctionData });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong while creating a new auction',
      );
    }
  }

  async updateAuction(
    id: string,
    email: string,
    updateAuctionDto: UpdateAuctionDto,
  ): Promise<Auction | null> {
    const auctionId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { email: email },
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

  async deleteAuction(id: number, email: string): Promise<Auction | null> {
    const auctionId = parseInt(String(id), 10);
    const user = await this.prisma.user.findUnique({
      where: { email: email },
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
    return this.prisma.auction.findMany({
      where: {
        endTime: {
          gt: new Date(), // This checks that the endTime is greater than the current date and time
        },
      },
    });
  }

  async findAuctionById(id: number): Promise<Auction | null> {
    const auctionId = parseInt(String(id), 10); // Ensure id is a number
    return this.prisma.auction.findUnique({
      where: {
        id: auctionId, // Use the correct variable name here
      },
    });
  }
  async findAuctionsCreatedByUser(email: string): Promise<Auction[]> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return this.prisma.auction.findMany({
      where: { userId: user.id },
    });
  }

  async findBiddingAuctionsByUser(email: string): Promise<Auction[]> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const now = new Date(); // Get current date and time
    return this.prisma.auction.findMany({
      where: {
        bids: {
          some: {
            userId: user.id,
          },
        },
        endTime: {
          gt: now,
        },
      },
    });
  }

  async findWonAuctionsByUser(email: string): Promise<Auction[]> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    // find all auctions that have ended
    const endedAuctions = await this.prisma.auction.findMany({
      where: {
        endTime: {
          lt: new Date(), // filter out auctions that have already ended
        },
      },
      include: {
        bids: {
          orderBy: {
            amount: 'desc', // order bids by amount in descending order
          },
          take: 1, // take the highest bid
        },
      },
    });
    // filter auctions where the highest bid was made by the user
    return endedAuctions.filter(
      (auction) =>
        auction.bids.length > 0 && auction.bids[0].userId === user.id,
    );
  }
}
