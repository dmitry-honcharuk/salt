import { isCreatorOrParticipant, ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function getListByIdUsecaseFactory({ listRepository }: Deps) {
  return async ({ listId: id, user }: Input): Promise<ListEntity | null> => {
    if (!user) {
      throw new CoreError('Forbidden');
    }

    if (!id) {
      throw new CoreError('Id is required');
    }

    const list = await listRepository.getListById(id);

    if (!list || !isCreatorOrParticipant(user, list)) {
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
  user?: UserEntity | null;
};
