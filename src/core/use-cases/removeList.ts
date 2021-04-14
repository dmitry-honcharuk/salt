import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function removeListUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ listId, creator }: Input): Promise<void> => {
    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('listId is required.');
    }

    const list = await listRepository.getListById(listId, { creator });

    if (!list) {
      throw new CoreError(`No such list found. (${listId})`);
    }

    await listRepository.removeList(listId, { creator });
  };
}

type Dependencies = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  creator?: UserEntity | null;
};
