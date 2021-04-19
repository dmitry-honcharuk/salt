import { CoreError } from '../errors/CoreError';
import { ListRepository } from '../interfaces/repositories/ListRepository';
import { signShareToken } from '../utils/jwt';

export function generateShareTokenFactory({ listRepository }: Dependencies) {
  return async ({ currentUserId, listId }: Input): Promise<string> => {
    if (!currentUserId) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('list id required');
    }

    const list = await listRepository.getListById(listId);

    if (list?.creator.id !== currentUserId) {
      throw new CoreError('Forbidden');
    }

    return signShareToken({ listId });
  };
}

type Dependencies = {
  listRepository: ListRepository;
};
type Input = {
  currentUserId?: string;
  listId?: string;
};
