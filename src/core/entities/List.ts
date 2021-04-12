import { ItemEntity } from './Item';
import { UserEntity } from './User';

export interface ListEntity {
  id: string;
  name: string;
  items: ItemEntity[];
  creator: UserEntity;
  createdAt: number;
}
