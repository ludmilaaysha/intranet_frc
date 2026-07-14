import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.channelsService.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.channelsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateChannelDto) {
    return this.channelsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChannelDto) {
    return this.channelsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.channelsService.remove(id);
  }
}