import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function addItemUsecaseFactory({ authService, listRepository }: Deps) {
  return async ({
    listId,
    content,
    done = false,
    createdAt = Date.now(),
  }: Input): Promise<ItemEntity> => {
    const creator = await authService.getCurrentUser();

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
  authService: AuthService;
};
type Input = {
  listId?: string;
  content?: string;
  done?: boolean;
  createdAt?: number;
};
