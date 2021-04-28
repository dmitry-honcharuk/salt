import { post } from 'app/implementations/services/request-client';
import { ListEntity } from 'core/entities/List';

export const createList = (options?: { name?: string }) =>
  post<ListEntity>('/api/lists', options);
