import { isCreatorOrParticipant } from '../entities/List';
import { UserEntity } from '../entities/User';
import { CoreError } from '../errors/CoreError';
import { ListRepository } from '../interfaces/repositories/ListRepository';

export function removeDoneItemsFactory({ listRepository }: Deps) {
  return async ({ listId, user }: Input): Promise<string[]> => {
    if (!user) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('listId is required');
    }

    const list = await listRepository.getListById(listId);

    if (!list || !isCreatorOrParticipant(user, list)) {
      throw new CoreError('Forbidden');
    }

    const removedItemIds = await listRepository.removeDoneItems(listId);

    if (!removedItemIds) {
      throw new CoreError('something went wrong');
    }

    return removedItemIds;
  };
}

type Deps = {
  listRepository: ListRepository;
};

type Input = {
  listId?: string;
  user?: UserEntity | null;
};
