import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { isCreatorOrParticipant } from '../entities/List';
import { UserEntity } from '../entities/User';

export function addItemUsecaseFactory({ listRepository }: Deps) {
  return async ({
    listId,
    content,
    done = false,
    createdAt = Date.now(),
    user,
  }: Input): Promise<ItemEntity> => {
    if (!user) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('List id is required');
    }

    const list = await listRepository.getListById(listId);

    if (!list || !isCreatorOrParticipant(user, list)) {
      throw new CoreError('Forbidden');
    }

    const item = await listRepository.addItemToList(listId, {
      content: content ?? '',
      done,
      createdAt,
    });

    if (!item) {
      throw new CoreError('Could not add item');
    }

    return item;
  };
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  content?: string;
  done?: boolean;
  createdAt?: number;
  user?: UserEntity | null;
};
