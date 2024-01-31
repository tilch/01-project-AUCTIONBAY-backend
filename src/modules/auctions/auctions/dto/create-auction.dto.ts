export class CreateAuctionDto {
  title: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  startTime: Date;
  endTime: Date;
  imageUrl?: string;
  userId: string;
}
