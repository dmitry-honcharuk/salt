import { ItemEntity } from './Item';
import { ParticipantEntity } from './Participant';
import { UserEntity } from './User';

export interface ListEntity {
  id: string;
  name: string;
  items: ItemEntity[];
  doneItems?: ItemEntity[];
  creator: UserEntity;
  createdAt: number;
  participants?: ParticipantEntity[];
}

export function isCreatorOrParticipant(
  user: UserEntity,
  list: ListEntity,
): boolean {
  const isCreator = user?.id === list?.creator.id;
  const isParticipant =
    list?.participants?.some(({ id }) => id === user.id) ?? false;

  return isCreator || isParticipant;
}
