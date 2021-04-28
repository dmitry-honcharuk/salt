import { patch } from 'app/implementations/services/request-client';
import { ListEntity } from 'core/entities/List';

export const updateListName = (options: {
  listId: string;
  name: string;
}): Promise<ListEntity> =>
  patch(`/api/lists/${options.listId}`, {
    name: options.name,
  });
