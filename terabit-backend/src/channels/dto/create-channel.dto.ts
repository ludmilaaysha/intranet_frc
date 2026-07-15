import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { ChannelCategory } from '../entities/channel.entity';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ChannelCategory)
  category: ChannelCategory;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  // @IsInt()
  // @Min(1)
  // @Max(65535)
  // port: number;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  autoStart: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;
}