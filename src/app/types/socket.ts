import { ItemEntity } from 'core/entities/Item';

export const TOPICS = {
  ITEM_ADDED: 'ITEM_ADDED',
  ITEM_TOGGLED: 'ITEM_TOGGLED',
  ITEM_CONTENT_CHANGED: 'ITEM_CONTENT_CHANGED',
  LIST_NAME_CHANGED: 'LIST_NAME_CHANGED',
  ITEM_REMOVED: 'ITEM_REMOVED',
} as const;

export type Event = {
  topic: keyof typeof TOPICS;
  payload: unknown;
};

export interface ItemAddedEvent extends Event {
  topic: typeof TOPICS.ITEM_ADDED;
  payload: {
    listId: string;
    item: ItemEntity;
  };
}

export interface ItemToggledEvent extends Event {
  topic: typeof TOPICS.ITEM_TOGGLED;
  payload: {
    listId: string;
    itemId: string;
    done: boolean;
  };
}

export interface ItemContentChangedEvent extends Event {
  topic: typeof TOPICS.ITEM_CONTENT_CHANGED;
  payload: {
    listId: string;
    itemId: string;
    content: string;
  };
}

export interface ListNameChangedEvent extends Event {
  topic: typeof TOPICS.LIST_NAME_CHANGED;
  payload: {
    listId: string;
    name: string;
  };
}

export interface ItemRemovedEvent extends Event {
  topic: typeof TOPICS.ITEM_REMOVED;
  payload: {
    listId: string;
    itemId: string;
  };
}
