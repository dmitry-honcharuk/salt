import {ListRepository} from "../interfaces/repositories/ListRepository";
import {CoreError} from "../errors/CoreError";

export function shareListUsecaseFactory({ listRepository }: Dependencies) {
    return async ({ listId, currentUserId }: Input) => {
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

        await listRepository.addParticipant({ listId, participantId: currentUserId })
    }
}

type Dependencies = {
    listRepository: ListRepository;
};

type Input = {
    listId?: string,
    currentUserId?: string,
}