import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { UserEntity } from 'core/entities/User';

export interface ListRepository {
  createList(options: {
    name: string;
    createdAt: number;
    creator: UserEntity;
  }): Promise<ListEntity>;
  getUserLists(options: { user: UserEntity }): Promise<ListEntity[]>;
  addItemToList(listId: string, options: AddItem): Promise<ItemEntity | null>;
  getListById(id: string): Promise<ListEntity | null>;
  updateItem(
    options: { listId: string; itemId: string },
    item: Omit<ItemEntity, 'id'>,
  ): Promise<null | ItemEntity>;
  updateListName(options: {
    listId: string;
    name: string;
    creator: UserEntity;
  }): Promise<null | ListEntity>;
  removeItem(options: { listId: string; itemId: string }): Promise<void>;
  removeList(listId: string, options: { creator: UserEntity }): Promise<void>;
  addParticipant(options: {
    listId: string;
    participantId: string;
    joinedAt: number;
  }): Promise<void>;
}

type AddItem = Omit<ItemEntity, 'id'>;
