import { List } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildGetListById({ listRepo }: Deps) {
  return async ({ id }: Input): Promise<List | null> => {
    if (!id) {
      throw new CoreError('Id is required');
    }

    const lists = await listRepo.getListById(id);

    return lists;
  };
}

type Deps = {
  listRepo: ListRepository;
};
type Input = {
  id?: string;
};