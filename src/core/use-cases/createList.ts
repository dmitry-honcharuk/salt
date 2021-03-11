import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildCreateList({ listRepository: listRepo }: Deps) {
  return async ({ name }: Input): Promise<ListEntity> => {
    const list = await listRepo.createList({
      name: name ?? '',
      createdAt: Date.now(),
    });

    return list;
  };
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  name?: string;
};
