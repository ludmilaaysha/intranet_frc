export type ChannelStatus = 'ONLINE' | 'OFFLINE';

export type ChannelCategory =
  | 'Notícias'
  | 'Esportes'
  | 'Filmes'
  | 'Séries'
  | 'Documentário'
  | 'Infantil'
  | 'Música'
  | 'Variedades';

export interface Channel {
  id: number;

  name: string;

  description: string;

  category: ChannelCategory;

  thumbnailUrl: string | null;

  videoUrl: string | null;

  multicastGroup: string;

  port: number;

  isActive: boolean;

  autoStart: boolean;

  lastBroadcast: string | null;

  viewers: number;

  status: ChannelStatus;

  featured: boolean;

  bannerUrl: string |null;

  subtitle: string | null;

  createdAt: string;
}