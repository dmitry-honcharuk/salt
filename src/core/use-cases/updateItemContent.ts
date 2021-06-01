import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import produce from 'immer';
import { isCreatorOrParticipant } from '../entities/List';
import { UserEntity } from '../entities/User';

export function updateItemContentUsecaseFactory({
  listRepository,
}: Dependencies) {
  return async ({
    listId,
    itemId,
    content,
    user,
  }: Input): Promise<ItemEntity> => {
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
      draft.content = content ?? '';
    });

    await listRepository.setItems({
      listId,
      items: list.items.map((item) =>
        item.id === itemId ? updatedItem : item,
      ),
    });

    return updatedItem;
  };
}

type Dependencies = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  itemId?: string;
  content?: string;
  user?: UserEntity | null;
};
