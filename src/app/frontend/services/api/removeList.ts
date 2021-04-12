import { del } from 'app/implementations/services/request-client';

export const removeList = (options: { listId: string }): Promise<void> =>
  del(`/api/lists/${options.listId}`);
