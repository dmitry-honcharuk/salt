import { ItemEntity } from './Item';

export interface ListEntity {
  id: string;
  name: string | null;
  items: ItemEntity[];
  createdAt: number;
}
