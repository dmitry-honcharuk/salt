import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';

export interface ListRepository {
  createList(options: { name: string; createdAt: number }): Promise<ListEntity>;
  getLists(): Promise<ListEntity[]>;
  addItem(options: {
    listId: string;
    content: string;
    done: boolean;
  }): Promise<ItemEntity | null>;
  getListById(id: string): Promise<ListEntity | null>;
  updateItem(
    options: { listId: string; itemId: string },
    item: Omit<ItemEntity, 'id'>,
  ): Promise<null | ItemEntity>;
  updateListName(options: {
    listId: string;
    name: string;
  }): Promise<null | ListEntity>;
}
