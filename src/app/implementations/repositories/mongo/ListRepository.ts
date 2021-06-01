import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
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
    removeList: async (listId: string, { creator }) => {
      const listCollection = await getListCollection();

      await listCollection.deleteOne({
        _id: new ObjectId(listId),
        'creator.id': creator.id,
      });
    },
    async setItems({ listId, items }): Promise<void> {
      const listCollection = await getListCollection();

      const filter = {
        _id: new ObjectId(listId),
      };

      await listCollection.updateOne(filter, {
        $set: { items },
      });
    },
    async setParticipants({ listId, participants }): Promise<void> {
      const listCollection = await getListCollection();

      const filter = {
        _id: new ObjectId(listId),
      };

      await listCollection.updateOne(filter, {
        $set: { participants },
      });
    },
  };
}

async function getListCollection(): Promise<Collection<WithId<ListSchema>>> {
  const db = await getDatabase();

  return db.collection<WithId<ListSchema>>('lists');
}
