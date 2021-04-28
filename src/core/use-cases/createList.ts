import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function createListUsecaseFactory({ listRepository }: Deps) {
  return async ({ name, creator }: Input): Promise<ListEntity> => {
    if (!creator) {
      throw new CoreError('Forbidden');
    }

    return listRepository.createList({
      name: name ?? '',
      createdAt: Date.now(),
      creator,
    });
  };
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  name?: string;
  creator?: UserEntity | null;
};
