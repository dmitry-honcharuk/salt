import { ItemEntity } from 'core/entities/Item';

export type DisplayableItem = Omit<ItemEntity, 'id' | 'createdAt'> & {
  displayId: ItemEntity['id'];
  id: null | ItemEntity['id'];
  createdAt: null | ItemEntity['createdAt'];
};
