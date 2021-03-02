import { List } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildGetLists({ listRepo }: Deps) {
  return async (): Promise<List[]> => {
    const lists = await listRepo.getLists();

    return lists;
  };
}

type Deps = {
  listRepo: ListRepository;
};
