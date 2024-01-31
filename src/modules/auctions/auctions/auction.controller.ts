import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  // create a new auction
  @ApiCreatedResponse({ description: 'List all auctions.' })
  @ApiBadRequestResponse({ description: 'Error for list all auctions.' })
  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.createAuction(createAuctionDto);
  }

  // update an auction
  @ApiCreatedResponse({ description: 'Update an auction' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    if (!req.user || !req.user.username) {
      throw new UnauthorizedException('User not authenticated.');
    }

    return this.auctionService.updateAuction(
      id,
      req.user.username,
      updateAuctionDto,
    );
  }

  // delete an auction
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req) {
    if (!req.user || !req.user.username) {
      throw new UnauthorizedException('User not authenticated.');
    }
    return this.auctionService.deleteAuction(id, req.user.username);
  }

  // najdi vse auctions-e od uporabnika iz ID-ja (od userja - userId)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.auctionService.findAllAuctionsByUser(userId);
  }

  // najdi vse auctione []
  @Get()
  async findAll() {
    return this.auctionService.findAllAuctions();
  }

  // najdi auction by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.auctionService.findAuctionById(id);
  }
}
