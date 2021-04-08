import { ListEntity } from 'core/entities/List';
import { post } from './client';

export const createList = (options?: { name?: string }) =>
  post<ListEntity>('/api/lists', options);
