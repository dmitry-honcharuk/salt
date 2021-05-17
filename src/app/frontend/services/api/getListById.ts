import { get } from 'app/implementations/services/request-client';
import { ListEntity } from '../../../../core/entities/List';

export const getListById = (options: { listId: string }): Promise<ListEntity | null> =>
  get<ListEntity | null>(`/api/lists/${options.listId}`);
