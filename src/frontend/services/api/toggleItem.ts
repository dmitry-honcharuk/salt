import { Item } from 'core/entities/Item';
import { put } from '../api';

export const toggleItem = (options: {
  listId: string;
  itemId: string;
}): Promise<Item> =>
  put(`/api/lists/${options.listId}/items/${options.itemId}/toggle`, {});
