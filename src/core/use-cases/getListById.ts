import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildGetListById({ listRepository: listRepo }: Deps) {
  return async ({ listId: id }: Input): Promise<ListEntity | null> => {
    if (!id) {
      throw new CoreError('Id is required');
    }

    const list = await listRepo.getListById(id);

    return list;
  };
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
};
