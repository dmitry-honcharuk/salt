import { get } from 'app/implementations/services/request-client';

export const getShareToken = (listId: string): Promise<Payload> => {
  return get<Payload>(`/api/lists/${listId}/token`);
};

type Payload = { token: string };
