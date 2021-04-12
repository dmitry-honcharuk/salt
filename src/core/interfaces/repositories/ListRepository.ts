import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { UserEntity } from 'core/entities/User';

export interface ListRepository {
  createList(options: {
    name: string;
    createdAt: number;
    creator: UserEntity;
  }): Promise<ListEntity>;
  getLists(options: { creator: UserEntity }): Promise<ListEntity[]>;
  addItem(options: AddItem): Promise<ItemEntity | null>;
  getListById(
    id: string,
    options: { creator: UserEntity },
  ): Promise<ListEntity | null>;
  updateItem(
    options: { listId: string; itemId: string; creator: UserEntity },
    item: Omit<ItemEntity, 'id'>,
  ): Promise<null | ItemEntity>;
  updateListName(options: {
    listId: string;
    name: string;
    creator: UserEntity;
  }): Promise<null | ListEntity>;
  removeItem(options: {
    listId: string;
    itemId: string;
    creator: UserEntity;
  }): Promise<void>;
  removeList(listId: string, options: { creator: UserEntity }): Promise<void>;
}

type AddItem = Omit<ItemEntity, 'id'> & {
  listId: string;
  creator: UserEntity;
};
