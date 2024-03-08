import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { Auction } from '../../../entities/auction.model';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuctionWithUserBid } from '../../../entities/auction.userBid.model';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async createAuction(
    createAuctionDto: CreateAuctionDto,
    email: string, // email instead of username
    imagePath: string,
  ): Promise<Auction> {
    const startPrice = parseFloat(String(createAuctionDto.startPrice));

    try {
      const auctionData = {
        ...createAuctionDto,
        startPrice: startPrice,
        imageUrl: imagePath,
        // Connect the auction to the user via email
        user: {
          connect: { email: email },
        },
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
    imagePath?: string,
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

    const updateData = {
      ...updateAuctionDto,
    };

    // If an image path is provided, include it in the update data
    if (imagePath) {
      updateData.imageUrl = imagePath;
    }
    return this.prisma.auction.update({
      where: { id: auctionId },
      data: updateData,
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

  async findAllAuctions(userEmail: string): Promise<AuctionWithUserBid[]> {
    const auctions = await this.prisma.auction.findMany({
      where: { endTime: { gt: new Date() } },
      orderBy: { endTime: 'asc' },
    });

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) throw new Error('User not found');

    // Fetch all user bids based on the found user's ID
    const userBids = await this.prisma.bid.findMany({
      where: { userId: user.id },
      select: { auctionId: true },
    });
    const userBidAuctionIds = userBids.map((bid) => bid.auctionId);

    // Enhance auctions with the userHasBid property
    return auctions.map((auction) => ({
      ...auction,
      userHasBid: userBidAuctionIds.includes(auction.id),
    }));
  }

  async findAuctionById(id: number): Promise<Auction | null> {
    const auctionId = parseInt(String(id), 10);
    return this.prisma.auction.findUnique({
      where: {
        id: auctionId,
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
    const now = new Date();
    const activeAuctions = await this.prisma.auction.findMany({
      where: {
        userId: user.id,
        endTime: {
          gt: now,
        },
      },
      orderBy: {
        endTime: 'asc',
      },
    });
    const expiredAuctions = await this.prisma.auction.findMany({
      where: {
        userId: user.id,
        endTime: {
          lte: now,
        },
      },
      orderBy: {
        endTime: 'asc',
      },
    });

    return [...activeAuctions, ...expiredAuctions];
  }

  async findBiddingAuctionsByUser(email: string): Promise<Auction[]> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const now = new Date();
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
