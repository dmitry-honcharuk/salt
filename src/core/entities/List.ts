import { Item } from './Item';

export interface List {
  id: string;
  name: string;
  items: Item[];
}
