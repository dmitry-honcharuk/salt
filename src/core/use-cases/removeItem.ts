import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function removeItemUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ listId, itemId, creator }: Input): Promise<void> => {
    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('listId is required.');
    }

    if (!itemId) {
      throw new CoreError('itemId is required.');
    }

    const list = await listRepository.getListById(listId, { creator });

    if (!list) {
      throw new CoreError(`No such list found. (${listId})`);
    }

    const item = list.items.find(({ id }) => id === itemId);

    if (!item) {
      throw new CoreError(`No such item found. (${itemId})`);
    }

    await listRepository.removeItem({ listId, itemId, creator });
  };
}

type Dependencies = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  itemId?: string;
  creator?: UserEntity | null;
};
