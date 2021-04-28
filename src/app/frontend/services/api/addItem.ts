import { post } from 'app/implementations/services/request-client';
import { ItemEntity } from 'core/entities/Item';

export const addItem = (options: {
  listId: string;
  content: string;
  done: boolean;
}): Promise<ItemEntity> =>
  post(`/api/lists/${options.listId}/items`, {
    content: options.content,
    done: options.done,
  });
