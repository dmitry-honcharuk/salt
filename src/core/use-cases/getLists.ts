import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildGetLists({ listRepository: listRepo }: Deps) {
  return async (): Promise<ListEntity[]> => {
    const lists = await listRepo.getLists();

    return lists;
  };
}

type Deps = {
  listRepository: ListRepository;
};
