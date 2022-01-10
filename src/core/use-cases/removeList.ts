import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';
import { FileStorage } from '../interfaces/services/file-storage.interface';

export function removeListUsecaseFactory({
  listRepository,
  fileStorage,
}: Dependencies) {
  return async ({ listId, creator }: Input): Promise<void> => {
    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('listId is required.');
    }

    const list = await listRepository.getListById(listId);

    if (!list) {
      throw new CoreError(`No such list found. (${listId})`);
    }

    if (creator?.id !== list.creator.id) {
      throw new CoreError('Forbidden');
    }

    await listRepository.removeList(listId, { creator });

    const images = list.items.flatMap((item) =>
      item.images
        ?.filter((url): url is string => Boolean(url))
        .map((url) => {
          const urlParts = url.split('/');

          return urlParts[urlParts.length - 1];
        })
    );

    await fileStorage.deleteObjects(<string[]>images);
  };
}

type Dependencies = {
  listRepository: ListRepository;
  fileStorage: FileStorage;
};
type Input = {
  listId?: string;
  creator?: UserEntity | null;
};
