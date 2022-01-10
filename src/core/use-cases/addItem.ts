import { ItemEntity } from 'core/entities/Item';
import { CoreError } from 'core/errors/CoreError';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { isCreatorOrParticipant, ListEntity } from '../entities/List';
import { UserEntity } from '../entities/User';

export function addItemUsecaseFactory({ listRepository }: Deps) {
  return async ({
    listId,
    content,
    done = false,
    images = [],
    createdAt = Date.now(),
    user,
  }: Input): Promise<ItemEntity> => {
    if (!user) {
      throw new CoreError('Forbidden');
    }

    if (!listId) {
      throw new CoreError('List id is required');
    }

    const list = await listRepository.getListById(listId);

    if (!list || !isCreatorOrParticipant(user, list)) {
      throw new CoreError('Forbidden');
    }

    const item: ItemEntity = {
      id: generateItemId(list),
      content: (content ?? '').trim(),
      done,
      images,
      createdAt,
    };

    await listRepository.setItems({
      listId,
      items: [item, ...list.items],
    });

    return item;
  };
}

function generateItemId(list: ListEntity): string {
  return `${list.id}-${Date.now()}-${list.items.length + 1}`;
}

type Deps = {
  listRepository: ListRepository;
};
type Input = {
  listId?: string;
  content?: string;
  images?: string[];
  done?: boolean;
  createdAt?: number;
  user?: UserEntity | null;
};
