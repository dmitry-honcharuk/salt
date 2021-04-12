import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function getListsUsecaseFactory({ authService, listRepository }: Deps) {
  return async (): Promise<ListEntity[]> => {
    const creator = await authService.getCurrentUser();

    if (!creator) {
      throw new CoreError('Forbidden');
    }

    const lists = await listRepository.getLists({
      creator,
    });

    return lists;
  };
}

type Deps = {
  listRepository: ListRepository;
  authService: AuthService;
};
