import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { GetUser } from '../../../decorators/user.decorator';

@Controller('bids')
@ApiTags('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create bid' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @GetUser() user: any,
    @Body() createBidDto: Omit<CreateBidDto, 'userId'>,
  ) {
    return this.bidService.createBidWithUserEmail(
      user.email,
      createBidDto.auctionId,
      createBidDto.amount,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all bids' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of bids.',
  })
  findAll() {
    return this.bidService.findAll();
  }

  @Get('auction/:auctionId')
  @ApiOperation({ summary: 'Retrieve all bids for a specific auction' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of bids for the auction.',
  })
  @ApiResponse({ status: 404, description: 'Auction not found.' })
  getBidsForAuction(@Param('auctionId') auctionId: number) {
    return this.bidService.getBidsForAuction(auctionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a bid by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved bid.' })
  @ApiResponse({ status: 404, description: 'Bid not found.' })
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bid' })
  @ApiResponse({
    status: 200,
    description: 'Bid has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Bid not found.' })
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(+id, updateBidDto.amount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bid' })
  @ApiResponse({
    status: 200,
    description: 'Bid has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Bid not found.' })
  remove(@Param('id') id: string) {
    return this.bidService.remove(+id);
  }
}
