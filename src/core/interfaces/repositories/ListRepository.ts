import { Item } from 'core/entities/Item';
import { List } from 'core/entities/List';

export interface ListRepository {
  createList(options: { name?: string; createdAt: number }): Promise<List>;
  getLists(): Promise<List[]>;
  addItem(options: { listId: string; content: string }): Promise<Item | null>;
  getListById(id: string): Promise<List | null>;
}
