import { put } from '../../../implementations/services/request-client';

export const participateInList = (token: string): Promise<Payload> => {
  return put<Payload>('/api/lists/participate', { token });
};

type Payload = { listId: string };
