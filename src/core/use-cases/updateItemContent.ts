import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import produce from 'immer';
import omit from 'lodash/omit';
import { UserEntity } from '../entities/User';
import {isCreatorOrParticipant} from "../entities/List";

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

    const result = await listRepository.updateItem(
      { listId, itemId },
      omit(updatedItem, ['id']),
    );

    if (!result) {
      throw new CoreError('Something went wrong');
    }

    return result;
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
