import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function getListByIdUsecaseFactory({
  authService,
  listRepository,
}: Deps) {
  return async ({ listId: id }: Input): Promise<ListEntity | null> => {
    const creator = await authService.getCurrentUser();

    if (!creator) {
      throw new CoreError('Forbidden');
    }

    if (!id) {
      throw new CoreError('Id is required');
    }

    const list = await listRepository.getListById(id, { creator });

    return list;
  };
}

type Deps = {
  listRepository: ListRepository;
  authService: AuthService;
};
type Input = {
  listId?: string;
};
