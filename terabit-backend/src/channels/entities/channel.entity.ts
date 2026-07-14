import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ChannelCategory {
  NOTICIAS = 'Notícias',
  ESPORTES = 'Esportes',
  FILMES = 'Filmes',
  SERIES = 'Séries',
  DOCUMENTARIO = 'Documentário',
  INFANTIL = 'Infantil',
  MUSICA = 'Música',
  VARIEDADES = 'Variedades',
}

export enum ChannelStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: ChannelCategory })
  category!: ChannelCategory;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  videoUrl!: string | null;

  @Column()
  multicastGroup!: string;

  @Column()
  port!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  autoStart!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastBroadcast!: Date | null;

  @Column({ default: 0 })
  viewers!: number;

  @Column({ type: 'enum', enum: ChannelStatus, default: ChannelStatus.OFFLINE })
  status!: ChannelStatus;

  @Column({ default: false })
  featured!: boolean;

  @Column({ type: 'varchar', nullable: true })
  bannerUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  subtitle!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}