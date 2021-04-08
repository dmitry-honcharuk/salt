import { del } from './client';

export const removeList = (options: { listId: string }): Promise<void> =>
  del(`/api/lists/${options.listId}`);
