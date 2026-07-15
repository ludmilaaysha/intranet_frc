import { ChannelCategory } from '../entities/channel.entity';
export declare class CreateChannelDto {
    name: string;
    description: string;
    category: ChannelCategory;
    thumbnailUrl?: string;
    videoUrl?: string;
    isActive: boolean;
    autoStart: boolean;
    featured?: boolean;
    bannerUrl?: string;
    subtitle?: string;
}
