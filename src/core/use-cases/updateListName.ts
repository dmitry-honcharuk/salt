import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function updateListNameUsecaseFactory({
  authService,
  listRepository,
}: Dependencies) {
  return async ({ listId, name }: Input): Promise<ListEntity> => {
    const creator = await authService.getCurrentUser();

    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('List id is required');
    }

    const updatedList = await listRepository.updateListName({
      listId,
      name: name ?? '',
      creator,
    });

    if (!updatedList) {
      throw new CoreError('Something went wrong');
    }

    return updatedList;
  };
}

type Dependencies = {
  listRepository: ListRepository;
  authService: AuthService;
};
type Input = {
  listId?: string;
  name?: string;
};
