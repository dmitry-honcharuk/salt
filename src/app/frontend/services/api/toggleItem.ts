import { put } from 'app/implementations/services/request-client';
import { ItemEntity } from 'core/entities/Item';

export const toggleItem = (options: {
  listId: string;
  itemId: string;
}): Promise<ItemEntity> =>
  put(`/api/lists/${options.listId}/items/${options.itemId}/toggle`, {});
