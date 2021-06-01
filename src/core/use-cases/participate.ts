import uniqueBy from 'lodash/uniqBy';
import { UserEntity } from '../entities/User';
import { CoreError } from '../errors/CoreError';
import {
  JoinedParticipant,
  ListRepository,
} from '../interfaces/repositories/ListRepository';
import { verifyShareToken } from '../utils/share-token';

export function participateUsecaseFactory({ listRepository }: Dependencies) {
  return async ({ token, currentUser }: Input): Promise<string> => {
    if (!currentUser) {
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

    const participants = (list.participants ?? []) as JoinedParticipant[];

    const participant: JoinedParticipant = {
      ...currentUser,
      joinedAt: Date.now(),
    };

    await listRepository.setParticipants({
      listId,
      participants: uniqueBy([...participants, participant], 'id'),
    });

    return listId;
  };
}

type Dependencies = {
  listRepository: ListRepository;
};

type Input = {
  token?: string;
  currentUser?: UserEntity;
};
