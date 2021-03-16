import { ListEntity } from 'core/entities/List';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';

export function buildUpdateListName({ listRepository }: Dependencies) {
  return async ({ listId, name }: Input): Promise<ListEntity> => {
    if (!listId) {
      throw new CoreError('List id is required');
    }

    const updatedList = await listRepository.updateListName({
      listId,
      name: name ?? '',
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
};
