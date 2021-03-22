import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildRemoveList({ listRepository }: Dependencies) {
  return async ({ listId }: Input): Promise<void> => {
    if (!listId) {
      throw new CoreError('listId is required.');
    }

    const list = await listRepository.getListById(listId);

    if (!list) {
      throw new CoreError(`No such list found. (${listId})`);
    }

    await listRepository.removeList(listId);
  };
}

type Dependencies = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
};
