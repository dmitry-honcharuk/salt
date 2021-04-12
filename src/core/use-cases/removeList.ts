import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function removeListUsecaseFactory({
  authService,
  listRepository,
}: Dependencies) {
  return async ({ listId }: Input): Promise<void> => {
    const creator = await authService.getCurrentUser();

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
  authService: AuthService;
};
type Input = {
  listId?: string;
};
