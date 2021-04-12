import { del } from 'app/implementations/services/request-client';

export const removeItem = (options: {
  listId: string;
  itemId: string;
}): Promise<void> =>
  del(`/api/lists/${options.listId}/items/${options.itemId}`);
