import { List } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildCreateList({ listRepo }: Deps) {
  return async ({ name }: Input): Promise<List> => {
    const list = await listRepo.createList({ name, createdAt: Date.now() });

    return list;
  };
}

type Deps = {
  listRepo: ListRepository;
};
type Input = {
  name?: string;
};
