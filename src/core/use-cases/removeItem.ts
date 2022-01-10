import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { isCreatorOrParticipant } from '../entities/List';
import { UserEntity } from '../entities/User';
import { FileStorage } from '../interfaces/services/file-storage.interface';

export function removeItemUsecaseFactory({
  listRepository,
  fileStorage,
}: Dependencies) {
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

    await listRepository.setItems({
      listId,
      items: list.items.filter((item) => item.id !== itemId),
    });

    if (!item.images) {
      return;
    }

    await fileStorage.deleteObjects(
      item.images.map((url) => {
        const urlParts = url.split('/');

        return urlParts[urlParts.length - 1];
      })
    );
  };
}

type Dependencies = {
  listRepository: ListRepository;
  fileStorage: FileStorage;
};
type Input = {
  listId?: string;
  itemId?: string;
  user?: UserEntity | null;
};
