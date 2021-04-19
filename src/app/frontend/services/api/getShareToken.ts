import { get } from 'app/implementations/services/request-client';

export const getShareToken = (listId: string) => {
    return get<{ token: string }>(`/api/lists/${listId}/token`);
}
