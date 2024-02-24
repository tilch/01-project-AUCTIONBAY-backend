import { Module } from '@nestjs/common';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AuctionModule } from './auctions/auctions/auction.module';
import { BidModule } from './bids/bid/bid.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    UserModule,
    AuthModule,
    AuctionModule,
    BidModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
