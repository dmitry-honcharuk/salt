import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { UserEntity } from 'core/entities/User';
import { ParticipantEntity } from '../../entities/Participant';
import { WithRequiredField } from '../../utils/WithRequiredField';

export interface ListRepository {
  createList(options: {
    name: string;
    createdAt: number;
    creator: UserEntity;
  }): Promise<ListEntity>;

  getUserLists(options: { user: UserEntity }): Promise<ListEntity[]>;

  getListById(id: string): Promise<ListEntity | null>;

  updateListName(options: {
    listId: string;
    name: string;
    creator: UserEntity;
  }): Promise<null | ListEntity>;

  removeList(listId: string, options: { creator: UserEntity }): Promise<void>;

  setParticipants(options: {
    listId: string;
    participants: JoinedParticipant[];
  }): Promise<void>;
  setItems(options: { listId: string; items: ItemEntity[] }): Promise<void>;
}

export type JoinedParticipant = WithRequiredField<
  ParticipantEntity,
  'joinedAt'
>;
