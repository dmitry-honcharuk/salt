import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';
import { ForbiddenError } from '../errors/ForbiddenError';

export function getListsUsecaseFactory({ listRepository }: Deps) {
  return async ({ user }: Input): Promise<ListEntity[]> => {
    if (!user) {
      throw new ForbiddenError();
    }

    return listRepository.getUserLists({ user });
  };
}

type Deps = {
  listRepository: ListRepository;
};

type Input = {
  user?: UserEntity | null;
};
