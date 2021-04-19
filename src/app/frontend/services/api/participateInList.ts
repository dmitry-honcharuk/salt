import {put} from "../../../implementations/services/request-client";

export const participateInList = (token: string): Promise<{listId: string}> => {
    return put<{listId: string}>('/api/lists/participate', { token });
}