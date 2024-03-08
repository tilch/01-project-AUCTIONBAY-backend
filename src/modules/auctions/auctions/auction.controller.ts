import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerConfigAuctions } from '../../../middleware/auctions-multer.config';

@ApiTags('auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfigAuctions))
  @ApiOperation({ summary: 'Create a new auction' })
  @ApiCreatedResponse({ description: 'Auction has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async create(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createAuctionDto: CreateAuctionDto,
  ) {
    if (!file)
      throw new BadRequestException('File upload failed or was not provided.');

    const imagePath = '/uploads/auctions/' + file.filename;
    const email = req.user.email;

    if (!email) {
      throw new BadRequestException('User email cannot be found.');
    }

    return this.auctionService.createAuction(
      createAuctionDto,
      email,
      imagePath,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfigAuctions))
  @ApiOperation({ summary: 'Update an auction' })
  @ApiOkResponse({ description: 'Auction has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateAuctionDto: UpdateAuctionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!req.user || !req.user.email) {
      throw new UnauthorizedException('User not authenticated.');
    }
    const imagePath = file ? '/uploads/auctions/' + file.filename : undefined; // Handle file path as needed
    return this.auctionService.updateAuction(
      id,
      req.user.email,
      updateAuctionDto,
      imagePath,
    );
  }
  @Get('/my-auctions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get auctions created by the current user' })
  async findUserAuctions(@Req() req) {
    const email = req.user.email;
    return this.auctionService.findAuctionsCreatedByUser(email);
  }

  @Get('/bidding')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get auctions where the current user is bidding' })
  async findBiddingAuctions(@Req() req) {
    const email = req.user.email;
    return this.auctionService.findBiddingAuctionsByUser(email);
  }

  @Get('/won')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get auctions won by the current user' })
  async findWonAuctions(@Req() req) {
    const email = req.user.email;
    return this.auctionService.findWonAuctionsByUser(email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an auction' })
  @ApiOkResponse({ description: 'Auction has been successfully deleted.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async delete(@Param('id') id: number, @Req() req) {
    if (!req.user || !req.user.email) {
      throw new UnauthorizedException('User not authenticated.');
    }
    return this.auctionService.deleteAuction(id, req.user.email);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get auctions by user ID' })
  @ApiOkResponse({ description: 'List of auctions for the specified user.' })
  async findAllByUser(@Param('userId') userId: string) {
    return this.auctionService.findAllAuctionsByUser(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all auctions' })
  @ApiOkResponse({ description: 'List of all auctions.' })
  async findAll(@Req() req) {
    if (!req.user || !req.user.email) {
      throw new UnauthorizedException('User not authenticated.');
    }
    return this.auctionService.findAllAuctions(req.user.email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an auction by ID' })
  @ApiOkResponse({ description: 'Details of the auction.' })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  async findOne(@Param('id') id: number) {
    return this.auctionService.findAuctionById(id);
  }
}
