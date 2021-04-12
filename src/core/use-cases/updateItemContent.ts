import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';
import produce from 'immer';
import omit from 'lodash/omit';

export function updateItemContentUsecaseFactory({
  authService,
  listRepository,
}: Dependencies) {
  return async ({ listId, itemId, content }: Input): Promise<ItemEntity> => {
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

    const updatedItem = produce(item, (draft) => {
      draft.content = content ?? '';
    });

    const result = await listRepository.updateItem(
      { listId, itemId, creator },
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
  authService: AuthService;
};
type Input = {
  listId?: string;
  itemId?: string;
  content?: string;
};
