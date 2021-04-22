import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';
import { ForbiddenError } from '../errors/ForbiddenError';

export function getListsUsecaseFactory({ listRepository }: Deps) {
  return async ({ creator }: Input): Promise<ListEntity[]> => {
    if (!creator) {
      throw new ForbiddenError();
    }

    return listRepository.getUserLists({
      user: creator,
    });
  };
}

type Deps = {
  listRepository: ListRepository;
};

type Input = {
  creator?: UserEntity | null;
};
