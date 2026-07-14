import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  Matches,
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

  // 224.0.0.0 – 239.255.255.255 (faixa multicast válida)
  @Matches(/^(22[4-9]|23[0-9])\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/, {
    message: 'Endereço multicast inválido (use algo entre 224.0.0.0 e 239.255.255.255)',
  })
  multicastGroup: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

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