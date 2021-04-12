import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';
import { ForbiddenError } from '../errors/ForbiddenError';

export function getListsUsecaseFactory({ authService, listRepository }: Deps) {
  return async (): Promise<ListEntity[]> => {
    const creator = await authService.getCurrentUser();

    if (!creator) {
      throw new ForbiddenError();
    }

    return listRepository.getLists({
      creator,
    });
  };
}

type Deps = {
  listRepository: ListRepository;
  authService: AuthService;
};
