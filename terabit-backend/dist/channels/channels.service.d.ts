import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
export declare class ChannelsService {
    private readonly channelsRepository;
    constructor(channelsRepository: Repository<Channel>);
    private transmissions;
    findAll(): Promise<Channel[]>;
    findFeatured(): Promise<Channel[]>;
    findOne(id: number): Promise<Channel>;
    create(dto: CreateChannelDto): Promise<Channel>;
    update(id: number, dto: UpdateChannelDto): Promise<Channel>;
    remove(id: number): Promise<void>;
    private generateMulticastGroup;
    startTransmission(id: number): Promise<{
        message: string;
    }>;
    stopTransmission(id: number): Promise<{
        message: string;
    }>;
    onModuleInit(): Promise<void>;
    playlist(id: number): Promise<string>;
}
