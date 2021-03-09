import { Item } from './Item';

export interface List {
  id: string;
  name: string | null;
  items: Item[];
  createdAt: number;
}
