import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class BidService {
  constructor(private prisma: PrismaService) {}

  async createBidWithUserEmail(
    email: string,
    auctionId: number,
    amount: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.createBid(user.id, auctionId, amount);
  }

  async createBid(userId: string, auctionId: number, amount: number) {
    const bid = await this.prisma.bid.create({
      data: {
        userId,
        auctionId,
        amount,
        bidTime: new Date(),
      },
    });

    await this.prisma.auction.update({
      where: { id: auctionId },
      data: { currentPrice: amount },
    });

    return bid;
  }

  async findAll() {
    return this.prisma.bid.findMany();
  }

  async findOne(id: number) {
    return this.prisma.bid.findUnique({
      where: { id },
    });
  }

  async update(id: number, amount: number) {
    return this.prisma.bid.update({
      where: { id },
      data: { amount },
    });
  }

  async remove(id: number) {
    return this.prisma.bid.delete({
      where: { id },
    });
  }

  async getBidsForAuction(auctionId: number) {
    const auctionId_parsed = parseInt(String(auctionId), 10);
    return this.prisma.bid.findMany({
      where: {
        auctionId: auctionId_parsed,
      },
      include: {
        user: true,
      },
      orderBy: {
        bidTime: 'desc',
      },
    });
  }
}
