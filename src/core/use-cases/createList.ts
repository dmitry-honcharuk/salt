import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { AuthService } from 'core/interfaces/services/AuthService';

export function createListUsecaseFactory({
  authService,
  listRepository,
}: Deps) {
  return async ({ name }: Input): Promise<ListEntity> => {
    const creator = await authService.getCurrentUser();

    if (!creator) {
      throw new CoreError('Forbidden');
    }

    const list = await listRepository.createList({
      name: name ?? '',
      createdAt: Date.now(),
      creator,
    });

    return list;
  };
}

type Deps = {
  listRepository: ListRepository;
  authService: AuthService;
};
type Input = {
  name?: string;
};
