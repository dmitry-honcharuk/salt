import { CoreError } from '../errors/CoreError';
import { ListRepository } from '../interfaces/repositories/ListRepository';

export function shareListUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ listId, currentUserId }: Input): Promise<void> => {
    if (!currentUserId) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('list id required');
    }

    const list = await listRepository.getListById(listId);

    if (!list) {
      throw new CoreError('list not found');
    }

    await listRepository.addParticipant({
      listId,
      participantId: currentUserId,
    });
  };
}

type Dependencies = {
  listRepository: ListRepository;
};

type Input = {
  listId?: string;
  currentUserId?: string;
};
