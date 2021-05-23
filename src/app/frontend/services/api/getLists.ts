import { get } from 'app/implementations/services/request-client';
import { ListEntity } from '../../../../core/entities/List';

export const getLists = (): Promise<ListEntity[]> =>
  get<ListEntity[]>(`/api/lists`);
