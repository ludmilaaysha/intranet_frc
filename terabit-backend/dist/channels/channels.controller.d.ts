import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import type { Response } from 'express';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    findAll(): Promise<import("./entities/channel.entity").Channel[]>;
    findFeatured(): Promise<import("./entities/channel.entity").Channel[]>;
    findOne(id: number): Promise<import("./entities/channel.entity").Channel>;
    create(dto: CreateChannelDto): Promise<import("./entities/channel.entity").Channel>;
    uploadFile(file: Express.Multer.File): {
        url: string;
    };
    update(id: number, dto: UpdateChannelDto): Promise<import("./entities/channel.entity").Channel>;
    remove(id: number): Promise<void>;
    startTransmission(id: number): Promise<{
        message: string;
    }>;
    stopTransmission(id: number): Promise<{
        message: string;
    }>;
    playlist(id: number, res: Response): Promise<void>;
}
