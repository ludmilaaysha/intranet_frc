import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  findAll(): Promise<Channel[]> {
    return this.channelsRepository.find();
  }

  findFeatured(): Promise<Channel[]> {
    return this.channelsRepository.find({ where: { featured: true } });
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({ where: { id } });
    if (!channel) {
      throw new NotFoundException(`Canal ${id} não encontrado`);
    }
    return channel;
  }

  create(dto: CreateChannelDto): Promise<Channel> {
    const channel = this.channelsRepository.create(dto);
    return this.channelsRepository.save(channel);
  }

  async update(id: number, dto: UpdateChannelDto): Promise<Channel> {
    const channel = await this.findOne(id);
    Object.assign(channel, dto);
    return this.channelsRepository.save(channel);
  }

  async remove(id: number): Promise<void> {
    const result = await this.channelsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Canal ${id} não encontrado`);
    }
  }
}