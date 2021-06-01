import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import {
  ListRepository,
  ParticipantToAdd,
} from 'core/interfaces/repositories/ListRepository';
import produce from 'immer';
import uniqueBy from 'lodash/uniqBy';
import { Collection, ObjectId, WithId } from 'mongodb';
import { getDatabase } from './mongo.client';

type ListSchema = Omit<ListEntity, 'id'>;

export function buildMongoListRepository(): ListRepository {
  return {
    createList: async ({ name, createdAt, creator }) => {
      const listCollection = await getListCollection();

      const list: ListSchema = {
        name,
        creator,
        items: [],
        doneItems: [],
        createdAt,
      };

      const entry = await listCollection.insertOne(list);

      return {
        ...list,
        creator,
        id: entry.insertedId.toHexString(),
      };
    },
    getUserLists: async ({ user }) => {
      const listCollection = await getListCollection();

      const cursor = listCollection.find({
        $or: [{ 'creator.id': user.id }, { 'participants.id': user.id }],
      });

      return cursor
        .map(({ _id, ...list }) => ({
          ...list,
          id: _id.toHexString(),
        }))
        .toArray();
    },
    addItemToList: async (listId, { content, done, createdAt }) => {
      const listCollection = await getListCollection();
      const filter = {
        _id: new ObjectId(listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return null;
      }

      const item: ItemEntity = {
        id: generateItemId(list),
        content,
        done,
        createdAt,
      };

      const { modifiedCount } = await listCollection.updateOne(filter, {
        $set: {
          items: [item, ...list.items],
        },
      });

      if (!modifiedCount) {
        return null;
      }

      return item;
    },
    getListById: async (listId) => {
      const listCollection = await getListCollection();

      const list = await listCollection.findOne({
        _id: new ObjectId(listId),
      });

      if (!list) {
        return null;
      }

      const { _id, ...fields } = list;

      return {
        ...fields,
        id: _id.toHexString(),
      };
    },
    updateItem: async ({ listId, itemId }, itemFields) => {
      const listCollection = await getListCollection();
      const filter = {
        _id: new ObjectId(listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return null;
      }

      const updatedItem = { id: itemId, ...itemFields };

      const { modifiedCount } = await listCollection.updateOne(filter, {
        $set: {
          items: list.items.map((item) =>
            item.id === itemId ? updatedItem : item,
          ),
        },
      });

      if (!modifiedCount) {
        return null;
      }

      return updatedItem;
    },
    updateListName: async ({ listId, name, creator }) => {
      const listCollection = await getListCollection();

      const { value } = await listCollection.findOneAndUpdate(
        {
          _id: new ObjectId(listId),
          'creator.id': creator.id,
        },
        { $set: { name } },
      );

      if (!value) {
        return null;
      }

      const { _id, ...list } = value;

      return { id: _id.toHexString(), ...list, name, creator };
    },
    removeItem: async ({ listId, itemId }) => {
      const listCollection = await getListCollection();
      const filter = {
        _id: new ObjectId(listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return;
      }

      await listCollection.updateOne(filter, {
        $set: {
          items: list.items.filter((item) => item.id !== itemId),
        },
      });
    },
    removeList: async (listId: string, { creator }) => {
      const listCollection = await getListCollection();

      await listCollection.deleteOne({
        _id: new ObjectId(listId),
        'creator.id': creator.id,
      });
    },
    addParticipant: async (options: {
      listId: string;
      participant: ParticipantToAdd;
    }): Promise<void> => {
      const listCollection = await getListCollection();

      const filter = {
        _id: new ObjectId(options.listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return;
      }

      const participants = list.participants ?? [];

      await listCollection.updateOne(filter, {
        $set: {
          participants: uniqueBy([...participants, options.participant], 'id'),
        },
      });
    },
    async removeDoneItems(listId: string): Promise<string[] | null> {
      const listCollection = await getListCollection();

      const filter = {
        _id: new ObjectId(listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return null;
      }

      const idsToRemove = list.items
        .filter(({ done }) => done)
        .map(({ id }) => id);

      if (idsToRemove.length) {
        await listCollection.updateOne(filter, {
          $set: {
            items: list.items.filter(({ done }) => !done),
          },
        });
      }

      return idsToRemove;
    },
    async changeItemsOrder({ listId, itemIds }) {
      const listCollection = await getListCollection();

      const filter = {
        _id: new ObjectId(listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return;
      }

      const newItems = produce(list.items, (draft) => {
        draft.sort((a, b) => {
          const aIndex = itemIds.findIndex((id) => id === a.id);
          const bIndex = itemIds.findIndex((id) => id === b.id);

          return aIndex - bIndex;
        });
      });

      await listCollection.updateOne(filter, {
        $set: {
          items: newItems,
        },
      });
    },
    // @TODO is this correct approach ?
    // @TODO Remove migrate mongoß
    setItems(listId: string, items: ItemEntity[]): Promise<void> {},
    setDoneItems(listId: string, items: ItemEntity[]): Promise<void> {},
  };
}

async function getListCollection(): Promise<Collection<WithId<ListSchema>>> {
  const db = await getDatabase();

  return db.collection<WithId<ListSchema>>('lists');
}

function generateItemId(list: WithId<ListSchema>): string {
  return `${list._id.toHexString()}-${Date.now()}-${list.items.length + 1}`;
}
