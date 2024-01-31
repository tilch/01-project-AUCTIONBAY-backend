import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from '../config/schema.config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AuctionModule } from './auctions/auctions/auction.module';

@Module({
  imports: [UserModule, AuthModule, AuctionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
