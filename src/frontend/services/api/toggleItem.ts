import { ItemEntity } from 'core/entities/Item';
import { put } from './client';

export const toggleItem = (options: {
  listId: string;
  itemId: string;
}): Promise<ItemEntity> =>
  put(`/api/lists/${options.listId}/items/${options.itemId}/toggle`, {});
