import { List } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildCreateList({ listRepo }: Deps) {
  return async ({ name }: Input): Promise<List> => {
    if (!name) {
      throw new CoreError('Name is required');
    }

    const list = await listRepo.createList({ name });

    return list;
  };
}

type Deps = {
  listRepo: ListRepository;
};
type Input = {
  name?: string;
};
