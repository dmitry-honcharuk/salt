import { List } from 'core/entities/List';

export interface ListRepository {
  createList(options: { name: string }): Promise<List>;
  getLists(): Promise<List[]>;
}
