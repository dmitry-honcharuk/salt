import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function addItemUsecaseFactory({ listRepository }: Deps) {
  return async ({
    listId,
    content,
    done = false,
    createdAt = Date.now(),
    creator,
  }: Input): Promise<ItemEntity> => {
    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('List id is required');
    }

    const item = await listRepository.addItem({
      listId,
      content: content ?? '',
      done,
      createdAt,
      creator,
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
  creator?: UserEntity | null;
};
