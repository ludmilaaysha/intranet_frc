import { api } from './api';

export async function getAll() {
  const { data } = await api.get('/channels');
  return data;
}

export async function getOne(id: number) {
  const { data } = await api.get(`/channels/${id}`);
  return data;
}

export async function createOne(channel: CreateChannelDto) {
  const { data } = await api.post('/channels', channel);
  return data;
}

export async function updateOne(
  id: number,
  channel: Partial<CreateChannelDto>,
) {
  const { data } = await api.patch(`/channels/${id}`, channel);
  return data;
}

export async function deleteOne(id: number) {
  await api.delete(`/channels/${id}`);
}