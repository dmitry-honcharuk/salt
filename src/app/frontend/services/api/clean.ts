import { del } from 'app/implementations/services/request-client';

export const cleanList = (listId: string): Promise<string[]> =>
  del<string[]>(`/api/lists/${listId}/clean`);
