import { ItemEntity } from 'core/entities/Item';

export type PendingItem = Omit<ItemEntity, 'id' | 'createdAt'> & {
  tempId: ItemEntity['id'];
};
