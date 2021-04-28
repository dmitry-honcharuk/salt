import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { UserEntity } from '../entities/User';

export function updateListNameUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ listId, name, creator }: Input): Promise<ListEntity> => {
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
};
type Input = {
  listId?: string;
  name?: string;
  creator?: UserEntity | null;
};
