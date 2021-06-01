import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import produce from 'immer';
import { isCreatorOrParticipant } from '../entities/List';
import { UserEntity } from '../entities/User';

export function toggleItemUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ listId, itemId, user }: Input): Promise<void> => {
    if (!user) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('listId is required.');
    }

    if (!itemId) {
      throw new CoreError('itemId is required.');
    }

    const list = await listRepository.getListById(listId);

    if (!list) {
      throw new CoreError(`No such list found. (${listId})`);
    }

    if (!isCreatorOrParticipant(user, list)) {
      throw new CoreError('Forbidden');
    }

    const item = list.items.find(({ id }) => id === itemId);

    if (!item) {
      throw new CoreError(`No such item found. (${itemId})`);
    }

    const updatedItem = produce(item, (draft) => {
      draft.done = !draft.done;
      draft.doneAt = draft.done ? Date.now() : null;
    });

    await listRepository.setItems({
      listId,
      items: [updatedItem, ...list.items.filter(({ id }) => id !== itemId)],
    });
  };
}

type Dependencies = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  itemId?: string;
  user?: UserEntity | null;
};
