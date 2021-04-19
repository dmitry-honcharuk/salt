import { CoreError } from '../errors/CoreError';
import { ListRepository } from '../interfaces/repositories/ListRepository';
import { verifyShareToken } from '../utils/jwt';

export function participateUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ token, currentUserId }: Input): Promise<string> => {
    if (!currentUserId) {
      throw new CoreError('Forbidden');
    }

    if (!token) {
      throw new CoreError('token required');
    }
    const { listId } = await verifyShareToken(token);
    const list = await listRepository.getListById(listId);

    if (!list) {
      throw new CoreError('list not found');
    }

    await listRepository.addParticipant({
      listId,
      participantId: currentUserId,
    });

    return listId;
  };
}

type Dependencies = {
  listRepository: ListRepository;
};

type Input = {
  token?: string;
  currentUserId?: string;
};
