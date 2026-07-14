import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';

import { Channel, ChannelStatus } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { DEFAULT_MULTICAST_PORT } from './channel.constants';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  private transmissions = new Map<number, ChildProcess>();

  findAll(): Promise<Channel[]> {
    return this.channelsRepository.find();
  }

  findFeatured(): Promise<Channel[]> {
    return this.channelsRepository.find({
      take: 5,
      order: {
        viewers: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Canal ${id} não encontrado`);
    }

    return channel;
  }

  async create(dto: CreateChannelDto): Promise<Channel> {
    const multicastGroup = await this.generateMulticastGroup();

    const channel = this.channelsRepository.create({
      ...dto,
      multicastGroup,
      port: DEFAULT_MULTICAST_PORT,
    });

    return this.channelsRepository.save(channel);
  }

  async update(id: number, dto: UpdateChannelDto): Promise<Channel> {
    const channel = await this.findOne(id);

    Object.assign(channel, dto);

    return this.channelsRepository.save(channel);
  }

  async remove(id: number): Promise<void> {
    const processVlc = this.transmissions.get(id);
    if (processVlc) {
      processVlc.kill();
      this.transmissions.delete(id);
    }
    const result = await this.channelsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Canal ${id} não encontrado`);
    }
  }

  private async generateMulticastGroup(): Promise<string> {
    const channels = await this.channelsRepository.find();

    const used = new Set(
      channels.map((channel) => channel.multicastGroup),
    );

    for (let i = 1; i <= 254; i++) {
      const address = `239.10.10.${i}`;

      if (!used.has(address)) {
        return address;
      }
    }

    throw new Error('Não há grupos multicast disponíveis.');
  }

  /**
   * Inicia transmissão
   */
  async startTransmission(id: number) {
    const channel = await this.findOne(id);

    if (this.transmissions.has(id)) {
      return {
        message: 'Canal já está transmitindo.',
      };
    }

    if (!channel.videoUrl) {
      throw new BadRequestException('Canal não possui vídeo.');
    }

    const videoPath = join(
      process.cwd(),
      channel.videoUrl.replace(/^\/+/, ''),
    );

    const vlcPath =
      process.platform === 'win32'
        ? 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe'
        : 'cvlc';

    const processVlc = spawn(vlcPath, [
      videoPath,
      '--loop',
      '--sout',
      `#rtp{mux=ts,dst=${channel.multicastGroup},port=${channel.port}}`,
    ]);

    processVlc.stdout?.on('data', (data) => {
      console.log(data.toString());
    });

    processVlc.stderr?.on('data', (data) => {
      console.log(data.toString());
    });

    processVlc.on('error', (err) => {
      console.error(`Falha ao iniciar VLC para canal ${id}:`, err.message);
      this.transmissions.delete(id);
    });

    this.transmissions.set(id, processVlc);

    channel.status = ChannelStatus.ONLINE;
    channel.vlcPid = processVlc.pid ?? null;

    await this.channelsRepository.save(channel);

    return {
      message: 'Transmissão iniciada.',
    };
  }

  async stopTransmission(id: number) {
    const processVlc = this.transmissions.get(id);

    if (!processVlc) {
      return {
        message: 'Canal não está transmitindo.',
      };
    }

    processVlc.kill();

    this.transmissions.delete(id);

    const channel = await this.findOne(id);

    channel.status = ChannelStatus.OFFLINE;
    channel.vlcPid = null;

    await this.channelsRepository.save(channel);

    return {
      message: 'Transmissão encerrada.',
    };
  }
  async onModuleInit() {
    await this.channelsRepository
      .createQueryBuilder()
      .update(Channel)
      .set({
        status: ChannelStatus.OFFLINE,
        vlcPid: null,
      })
      .execute();
  }

  async playlist(id: number): Promise<string> {
    const channel = await this.findOne(id);

    channel.viewers++;
    await this.channelsRepository.save(channel);

    return `#EXTM3U
  #EXTINF:-1,${channel.name}
  udp://@${channel.multicastGroup}:${channel.port}
  `;
  }
}