import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildAddItem({ listRepository: listRepo }: Deps) {
  return async ({ listId, content }: Input): Promise<ItemEntity> => {
    if (!listId) {
      throw new CoreError('List id is required');
    }

    const item = await listRepo.addItem({
      listId,
      content: content ?? '',
      done: false,
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
};
