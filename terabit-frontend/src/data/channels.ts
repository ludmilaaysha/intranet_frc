// data/channels.ts
import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export type ChannelCategory =
  | 'Notícias'
  | 'Esportes'
  | 'Filmes'
  | 'Séries'
  | 'Documentário'
  | 'Infantil'
  | 'Música'
  | 'Variedades';

export const CHANNEL_CATEGORIES: ChannelCategory[] = [
  'Notícias',
  'Esportes',
  'Filmes',
  'Séries',
  'Documentário',
  'Infantil',
  'Música',
  'Variedades',
];

// Status é controlado pelo servidor de streaming / backend, não pelo formulário.
export type ChannelStatus = 'ONLINE' | 'OFFLINE';

export interface Channel {
  id: number;
  name: string;
  description: string;
  category: ChannelCategory;
  // No frontend guardamos apenas o nome do arquivo/URL selecionado.
  // Quando o backend existir, o upload real deve devolver a URL definitiva.
  thumbnailUrl: string | null;
  videoUrl: string | null;
  multicastGroup: string;
  port: number;
  isActive: boolean;
  autoStart: boolean;
  // Preenchidos/atualizados pelo backend após a criação do canal.
  lastBroadcast: string | null;
  viewers: number;
  status: ChannelStatus;
}

const INITIAL_CHANNELS_STORE: Channel[] = [
  {
    id: 1,
    name: 'Canal Notícias 24h',
    description: 'Cobertura de notícias em tempo integral.',
    category: 'Notícias',
    thumbnailUrl: null,
    videoUrl: null,
    multicastGroup: '239.10.10.1',
    port: 5004,
    isActive: true,
    autoStart: true,
    lastBroadcast: '2025-07-16T00:00:00.000Z',
    viewers: 128,
    status: 'ONLINE',
  },
  {
    id: 2,
    name: 'Esporte Total',
    description: 'Transmissões esportivas ao vivo.',
    category: 'Esportes',
    thumbnailUrl: null,
    videoUrl: null,
    multicastGroup: '239.10.10.2',
    port: 5005,
    isActive: true,
    autoStart: false,
    lastBroadcast: '2025-07-10T00:00:00.000Z',
    viewers: 0,
    status: 'OFFLINE',
  },
  {
    id: 3,
    name: 'Kids Play',
    description: 'Programação infantil educativa.',
    category: 'Infantil',
    thumbnailUrl: null,
    videoUrl: null,
    multicastGroup: '239.10.10.3',
    port: 5006,
    isActive: false,
    autoStart: false,
    lastBroadcast: null,
    viewers: 0,
    status: 'OFFLINE',
  },
];

export function getChannelsStore(): Channel[] {
  const stringifiedChannels = localStorage.getItem('channels-store');
  return stringifiedChannels ? JSON.parse(stringifiedChannels) : INITIAL_CHANNELS_STORE;
}

export function setChannelsStore(channels: Channel[]) {
  return localStorage.setItem('channels-store', JSON.stringify(channels));
}

export async function getMany({
  paginationModel,
  filterModel,
  sortModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): Promise<{ items: Channel[]; itemCount: number }> {
  const channelsStore = getChannelsStore();

  let filteredChannels = [...channelsStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredChannels = filteredChannels.filter((channel) => {
        const channelValue = channel[field as keyof Channel];

        switch (operator) {
          case 'contains':
            return String(channelValue).toLowerCase().includes(String(value).toLowerCase());
          case 'equals':
            return channelValue === value;
          case 'startsWith':
            return String(channelValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(channelValue).toLowerCase().endsWith(String(value).toLowerCase());
          case '>':
            return channelValue != null && channelValue > value;
          case '<':
            return channelValue != null && channelValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredChannels.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        const aValue = a[field as keyof Channel];
        const bValue = b[field as keyof Channel];

        // Trata null como "menor que qualquer valor" para não quebrar a comparação.
        if (aValue == null && bValue == null) {
          continue;
        }
        if (aValue == null) {
          return sort === 'asc' ? -1 : 1;
        }
        if (bValue == null) {
          return sort === 'asc' ? 1 : -1;
        }

        if (aValue < bValue) {
          return sort === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedChannels = filteredChannels.slice(start, end);

  return {
    items: paginatedChannels,
    itemCount: filteredChannels.length,
  };
}

export async function getOne(channelId: number) {
  const channelsStore = getChannelsStore();

  const channelToShow = channelsStore.find((channel) => channel.id === channelId);

  if (!channelToShow) {
    throw new Error('Channel not found');
  }
  return channelToShow;
}

// Campos que o formulário não deve enviar na criação: são preenchidos pelo
// backend/streaming server depois que o canal existe.
export type ChannelCreateInput = Omit<
  Channel,
  'id' | 'lastBroadcast' | 'viewers' | 'status'
>;

export async function createOne(data: ChannelCreateInput) {
  const channelsStore = getChannelsStore();

  const newChannel: Channel = {
    ...data,
    id: channelsStore.reduce((max, channel) => Math.max(max, channel.id), 0) + 1,
    // Valores controlados pelo backend/streaming server, não pelo formulário.
    lastBroadcast: null,
    viewers: 0,
    status: 'OFFLINE',
  };

  setChannelsStore([...channelsStore, newChannel]);

  return newChannel;
}

export async function updateOne(channelId: number, data: Partial<Omit<Channel, 'id'>>) {
  const channelsStore = getChannelsStore();

  let updatedChannel: Channel | null = null;

  setChannelsStore(
    channelsStore.map((channel) => {
      if (channel.id === channelId) {
        updatedChannel = { ...channel, ...data };
        return updatedChannel;
      }
      return channel;
    }),
  );

  if (!updatedChannel) {
    throw new Error('Channel not found');
  }
  return updatedChannel;
}

export async function deleteOne(channelId: number) {
  const channelsStore = getChannelsStore();

  setChannelsStore(channelsStore.filter((channel) => channel.id !== channelId));
}

// Validation follows the [Standard Schema](https://standardschema.dev/).

type ValidationResult = { issues: { message: string; path: (keyof Channel)[] }[] };

// Faixa de endereços multicast IPv4 válida: 224.0.0.0 – 239.255.255.255
const MULTICAST_REGEX =
  /^(22[4-9]|23[0-9])\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function validate(channel: Partial<Channel>): ValidationResult {
  let issues: ValidationResult['issues'] = [];

  if (!channel.name) {
    issues = [...issues, { message: 'Nome do canal é obrigatório', path: ['name'] }];
  }

  if (!channel.description) {
    issues = [...issues, { message: 'Descrição é obrigatória', path: ['description'] }];
  }

  if (!channel.category) {
    issues = [...issues, { message: 'Categoria é obrigatória', path: ['category'] }];
  } else if (!CHANNEL_CATEGORIES.includes(channel.category)) {
    issues = [...issues, { message: 'Categoria inválida', path: ['category'] }];
  }

  if (!channel.multicastGroup) {
    issues = [
      ...issues,
      { message: 'Grupo multicast é obrigatório', path: ['multicastGroup'] },
    ];
  } else if (!MULTICAST_REGEX.test(channel.multicastGroup)) {
    issues = [
      ...issues,
      {
        message: 'Endereço multicast inválido (use algo entre 224.0.0.0 e 239.255.255.255)',
        path: ['multicastGroup'],
      },
    ];
  }

  if (!channel.port) {
    issues = [...issues, { message: 'Porta é obrigatória', path: ['port'] }];
  } else if (channel.port < 1 || channel.port > 65535) {
    issues = [...issues, { message: 'Porta deve estar entre 1 e 65535', path: ['port'] }];
  }

  return { issues };
}