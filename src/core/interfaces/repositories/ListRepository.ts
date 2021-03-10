import { Item } from 'core/entities/Item';
import { List } from 'core/entities/List';

export interface ListRepository {
  createList(options: {
    name: string | null;
    createdAt: number;
  }): Promise<List>;
  getLists(): Promise<List[]>;
  addItem(options: {
    listId: string;
    content: string;
    done: boolean;
  }): Promise<Item | null>;
  getListById(id: string): Promise<List | null>;
  updateItem(
    options: { listId: string; itemId: string },
    item: Omit<Item, 'id'>,
  ): Promise<null | Item>;
}
