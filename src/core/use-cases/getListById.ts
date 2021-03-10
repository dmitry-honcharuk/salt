import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildGetListById({ listRepo }: Deps) {
  return async ({ listId: id }: Input): Promise<ListEntity | null> => {
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
  listId?: string;
};
