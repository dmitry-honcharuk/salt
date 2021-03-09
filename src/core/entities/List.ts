import { ItemEntity } from './Item';

export interface ListEntity {
  id: string;
  name: string;
  items: ItemEntity[];
  createdAt: number;
}
