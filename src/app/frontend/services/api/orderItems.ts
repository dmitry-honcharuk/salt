import { put } from 'app/implementations/services/request-client';
import { ItemEntity } from 'core/entities/Item';

export const orderItems = (options: {
  listId: string;
  itemIds: string[];
}): Promise<ItemEntity> =>
  put(`/api/lists/${options.listId}/items/order`, {
    listId: options.listId,
    itemIds: options.itemIds,
  });
