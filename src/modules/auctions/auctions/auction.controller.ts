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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new auction' })
  @ApiCreatedResponse({ description: 'Auction has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.createAuction(createAuctionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an auction' })
  @ApiOkResponse({ description: 'Auction has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an auction' })
  @ApiOkResponse({ description: 'Auction has been successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async delete(@Param('id') id: number, @Req() req) {
    if (!req.user || !req.user.username) {
      throw new UnauthorizedException('User not authenticated.');
    }
    return this.auctionService.deleteAuction(id, req.user.username);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get auctions by user ID' })
  @ApiOkResponse({ description: 'List of auctions for the specified user.' })
  async findAllByUser(@Param('userId') userId: string) {
    return this.auctionService.findAllAuctionsByUser(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all auctions' })
  @ApiOkResponse({ description: 'List of all auctions.' })
  async findAll() {
    return this.auctionService.findAllAuctions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an auction by ID' })
  @ApiOkResponse({ description: 'Details of the auction.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async findOne(@Param('id') id: number) {
    return this.auctionService.findAuctionById(id);
  }
}
