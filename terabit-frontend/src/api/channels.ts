import type {
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';

const API_URL = import.meta.env.VITE_API_URL;
console.log('API_URL:', API_URL);

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

export type ChannelStatus = 'ONLINE' | 'OFFLINE';

export async function startTransmission(channelId: number) {
  return request(`/channels/${channelId}/start`, {
    method: 'POST',
  });
}

export async function stopTransmission(channelId: number) {
  return request(`/channels/${channelId}/stop`, {
    method: 'POST',
  });
}

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
  bannerUrl: string | null;
  subtitle: string | null;
}

export interface ChannelCreateInput {
  name: string;
  description: string;
  category: ChannelCategory;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  isActive: boolean;
  autoStart: boolean;
  featured?: boolean;
  bannerUrl?: string | null;
  subtitle?: string | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? `Erro ${response.status} ao acessar ${path}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
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

  const params = new URLSearchParams();

  params.set('page', String(paginationModel.page));
  params.set('pageSize', String(paginationModel.pageSize));

  if (sortModel.length) {
    params.set('sort', JSON.stringify(sortModel));
  }

  if (filterModel.items.length) {
    params.set('filter', JSON.stringify(filterModel.items));
  }

  const channels = await request<Channel[]>(
    `/channels?${params.toString()}`
  );

  return {
    items: channels,
    itemCount: channels.length,
  };
}

export async function getFeatured(): Promise<Channel[]> {
  return request('/channels/featured');
}

export async function getOne(channelId: number): Promise<Channel> {
  return request(`/channels/${channelId}`);
}

export async function createOne(data: ChannelCreateInput): Promise<Channel> {
  return request('/channels', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOne(
  channelId: number,
  data: Partial<Omit<Channel, 'id'>>,
): Promise<Channel> {
  return request(`/channels/${channelId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteOne(channelId: number): Promise<void> {
  return request(`/channels/${channelId}`, { method: 'DELETE' });
}

type ValidationResult = { issues: { message: string; path: (keyof Channel)[] }[] };

// const MULTICAST_REGEX = /^(22[4-9]|23[0-9])\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

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
  // if (!channel.multicastGroup) {
  //   issues = [
  //     ...issues,
  //     { message: 'Grupo multicast é obrigatório', path: ['multicastGroup'] },
  //   ];
  // } else if (!MULTICAST_REGEX.test(channel.multicastGroup)) {
  //   issues = [
  //     ...issues,
  //     {
  //       message: 'Endereço multicast inválido (use algo entre 224.0.0.0 e 239.255.255.255)',
  //       path: ['multicastGroup'],
  //     },
  //   ];
  // }
  // if (!channel.port) {
  //   issues = [...issues, { message: 'Porta é obrigatória', path: ['port'] }];
  // } else if (channel.port < 1 || channel.port > 65535) {
  //   issues = [...issues, { message: 'Porta deve estar entre 1 e 65535', path: ['port'] }];
  // }

  return { issues };
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/channels/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    throw new Error(text);
  }

  const data = await response.json();

  return data.url;
}

export function watchChannel(channelId: number) {
  window.location.href =
    `${API_URL}/channels/${channelId}/playlist`;
}