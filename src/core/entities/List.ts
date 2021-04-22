import { ItemEntity } from './Item';
import { ParticipantEntity } from './Participant';
import { UserEntity } from './User';

export interface ListEntity {
  id: string;
  name: string;
  items: ItemEntity[];
  creator: UserEntity;
  createdAt: number;
  participants?: ParticipantEntity[];
}
