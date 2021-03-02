import { List } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildMemoryListRepository(): ListRepository {
  const lists: List[] = [];

  return {
    createList: async ({ name }) => {
      const list: List = {
        id: `${lists.length + 1}`,
        items: [],
        name,
      };

      lists.push(list);

      return list;
    },
    getLists: async () => lists,
  };
}
