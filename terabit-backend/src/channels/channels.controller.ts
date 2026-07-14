import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';
import type { Multer } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/auth.types';

@Controller('channels')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateChannelDto) {
    return this.channelsService.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      url: `/uploads/thumbnails/${file.filename}`,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChannelDto,
  ) {
    return this.channelsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.channelsService.remove(id);
  }

  @Post(':id/start')
  startTransmission(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelsService.startTransmission(id);
  }

  @Post(':id/stop')
  stopTransmission(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.channelsService.stopTransmission(id);
  }

  @Get(':id/playlist')
  async playlist(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const playlist = await this.channelsService.playlist(id);

    res.setHeader('Content-Type', 'audio/x-mpegurl');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="canal-${id}.m3u"`,
    );

    res.send(playlist);
  }
}