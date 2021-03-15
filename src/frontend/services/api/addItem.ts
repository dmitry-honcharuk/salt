import { ItemEntity } from 'core/entities/Item';
import { post } from './client';

export const addItem = (options: {
  listId: string;
  content: string;
}): Promise<ItemEntity> =>
  post(`/api/lists/${options.listId}/items`, {
    content: options.content,
  });
