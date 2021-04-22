import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import uniqueBy from 'lodash/uniqBy';
import { ObjectId, WithId } from 'mongodb';
import { ParticipantEntity } from '../../../../core/entities/Participant';
import { getDatabase } from './mongo.client';

type ListSchema = Omit<ListEntity, 'id' | 'creator'> & {
  creator: string;
};

export function buildMongoListRepository(): ListRepository {
  return {
    createList: async ({ name, createdAt, creator }) => {
      const db = await getDatabase();

      const listCollection = db.collection<ListSchema>('lists');

      const list: ListSchema = {
        name,
        items: [],
        creator: creator.id,
        createdAt,
      };

      const entry = await listCollection.insertOne(list);

      return {
        ...list,
        creator,
        id: entry.insertedId.toHexString(),
      };
    },
    getLists: async ({ creator }) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

      const cursor = listCollection.find({
        creator: creator.id,
      });

      return cursor
        .map(({ _id, ...list }) => ({
          ...list,
          creator,
          id: _id.toHexString(),
        }))
        .toArray();
    },
    addItem: async ({ listId, content, done, creator, createdAt }) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');
      const filter = {
        _id: new ObjectId(listId),
        creator: creator.id,
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return null;
      }

      const item: ItemEntity = {
        id: genereteItemId(list),
        content,
        done,
        createdAt,
      };

      const { modifiedCount } = await listCollection.updateOne(filter, {
        $set: { items: [...list.items, item] },
      });

      if (!modifiedCount) {
        return null;
      }

      return item;
    },
    getListById: async (listId) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

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
        creator: {
          id: list.creator,
        },
      };
    },
    updateItem: async ({ listId, itemId, creator }, itemFields) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');
      const filter = {
        _id: new ObjectId(listId),
        creator: creator.id,
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
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

      const { value } = await listCollection.findOneAndUpdate(
        {
          _id: new ObjectId(listId),
          creator: creator.id,
        },
        { $set: { name } },
      );

      if (!value) {
        return null;
      }

      const { _id, ...list } = value;

      return { id: _id.toHexString(), ...list, name, creator };
    },
    removeItem: async ({ listId, itemId, creator }) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');
      const filter = {
        _id: new ObjectId(listId),
        creator: creator.id,
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
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

      await listCollection.deleteOne({
        _id: new ObjectId(listId),
        creator: creator.id,
      });
    },
    addParticipant: async (options: {
      listId: string;
      participantId: string;
      joinedAt: number;
    }): Promise<void> => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

      const filter = {
        _id: new ObjectId(options.listId),
      };

      const list = await listCollection.findOne(filter);

      if (!list) {
        return;
      }

      const participant: ParticipantEntity = {
        id: options.participantId,
        joinedAt: options.joinedAt,
      };

      const participants = list.participants ?? [];

      await listCollection.updateOne(filter, {
        $set: {
          participants: uniqueBy([...participants, participant], 'id'),
        },
      });
    },
  };
}

function genereteItemId(list: WithId<ListSchema>): string {
  return `${list._id.toHexString()}-${Date.now()}-${list.items.length + 1}`;
}
