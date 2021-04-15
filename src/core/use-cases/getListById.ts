import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function getListByIdUsecaseFactory({ listRepository }: Deps) {
  return async ({ listId: id, creator }: Input): Promise<ListEntity | null> => {
    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!id) {
      throw new CoreError('Id is required');
    }

    const list = await listRepository.getListById(id);

    if (creator?.id !== list?.creator.id) {
      throw new CoreError('Forbidden');
    }

    return list;
  };
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  creator?: UserEntity | null;
};
