import { ListEntity } from 'core/entities/List';
import { patch } from './client';

export const updateListName = (options: {
  listId: string;
  name: string;
}): Promise<ListEntity> =>
  patch(`/api/lists/${options.listId}`, {
    name: options.name,
  });
