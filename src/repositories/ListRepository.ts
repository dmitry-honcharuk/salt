import { Item } from 'core/entities/Item';
import { List } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildMemoryListRepository(): ListRepository {
  const lists: List[] = [];

  return {
    createList: async ({ name, createdAt }) => {
      const list: List = {
        id: `${lists.length + 1}`,
        items: [],
        name,
        createdAt,
      };

      lists.push(list);

      return list;
    },
    getLists: async () => lists,
    addItem: async ({ listId, content }) => {
      const list = lists.find(({ id }) => id === listId);

      if (!list) {
        return null;
      }

      const item: Item = { id: `${list.items.length + 1}`, content };

      list.items.push(item);

      return item;
    },
    getListById: async (listId) => {
      return lists.find(({ id }) => id === listId) ?? null;
    },
  };
}
