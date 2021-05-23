import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { isCreatorOrParticipant } from '../entities/List';
import { UserEntity } from '../entities/User';

export function changeOrderUsecaseFactory({ listRepository }: Deps) {
  return async ({ listId, user, itemIds }: Input): Promise<void> => {
    if (!user) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('List id is required');
    }

    if (!itemIds?.length) {
      throw new CoreError('Item ids are required');
    }

    const list = await listRepository.getListById(listId);

    if (!list || !isCreatorOrParticipant(user, list)) {
      throw new CoreError('Forbidden');
    }

    await listRepository.changeItemsOrder({
      listId,
      userId: user.id,
      itemIds,
    });
  };
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  user?: UserEntity | null;
  itemIds?: [];
};