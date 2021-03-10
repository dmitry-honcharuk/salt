import { Item } from 'core/entities/Item';
import { List } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildMemoryListRepository(): ListRepository {
  const lists: List[] = [
    {
      id: '1',
      name: null,
      items: [
        {
          id: '1',
          content: 'Milk',
          done: false,
        },
        {
          id: '2',
          content: 'Eggs',
          done: true,
        },
        {
          id: '3',
          content: 'Bread',
          done: false,
        },
      ],
      createdAt: Date.now(),
    },
  ];

  return {
    createList: async ({ name, createdAt }) => {
      const list: List = {
        id: `${lists.length + 1}`,
        items: [],
        createdAt,
        name,
      };

      lists.push(list);

      return list;
    },
    getLists: async () => lists,
    addItem: async ({ listId, content, done }) => {
      const list = lists.find(({ id }) => id === listId);

      if (!list) {
        return null;
      }

      const item: Item = { id: `${list.items.length + 1}`, content, done };

      list.items.push(item);

      return item;
    },
    getListById: async (listId) => {
      return lists.find(({ id }) => id === listId) ?? null;
    },
    updateItem: async ({ listId, itemId }, updatedItem) => {
      const list = lists.find(({ id }) => id === listId);

      if (!list) return null;

      const itemIndex = list.items.findIndex(({ id }) => id === itemId);

      if (itemIndex === -1) return null;

      list.items[itemIndex] = {
        id: list.items[itemIndex].id,
        ...updatedItem,
      };

      return list.items[itemIndex];
    },
  };
}
