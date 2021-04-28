import { put } from 'app/implementations/services/request-client';
import { ItemEntity } from 'core/entities/Item';

export const updateItemContent = (options: {
  listId: string;
  itemId: string;
  content: string;
}): Promise<ItemEntity> =>
  put(`/api/lists/${options.listId}/items/${options.itemId}`, {
    content: options.content,
  });
