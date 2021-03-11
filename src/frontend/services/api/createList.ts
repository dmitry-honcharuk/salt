import { ListEntity } from 'core/entities/List';
import { post } from '../api';

export const createList = (options?: { name?: string }) =>
  post<ListEntity>('/api/lists', options);
