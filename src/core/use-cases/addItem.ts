import { Item } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildAddItem({ listRepo }: Deps) {
  return async ({ listId, content }: Input): Promise<Item> => {
    if (!listId) {
      throw new CoreError('List id is required');
    }

    if (!content) {
      throw new CoreError('Content is required');
    }

    const item = await listRepo.addItem({ listId, content, done: false });

    if (!item) {
      throw new CoreError('Could not add item');
    }

    return item;
  };
}

type Deps = {
  listRepo: ListRepository;
};
type Input = {
  listId?: string;
  content?: string;
};
