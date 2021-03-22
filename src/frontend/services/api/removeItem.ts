import { del } from './client';

export const removeItem = (options: {
  listId: string;
  itemId: string;
}): Promise<void> =>
  del(`/api/lists/${options.listId}/items/${options.itemId}`);
