import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function removeItemUsecaseFactory({
  listRepository,
  authService,
}: Dependencies) {
  return async ({ listId, itemId }: Input): Promise<void> => {
    const creator = await authService.getCurrentUser();

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
  authService: AuthService;
};
type Input = {
  listId?: string;
  itemId?: string;
};
