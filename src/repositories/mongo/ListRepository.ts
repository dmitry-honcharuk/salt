import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { ListRepository } from 'core/interfaces/repositories/ListRepository';
import { ObjectId, WithId } from 'mongodb';
import { getDatabase } from './mongo.client';

type ListSchema = Omit<ListEntity, 'id'>;

export function buildMongoListRepository(): ListRepository {
  return {
    createList: async ({ name }) => {
      const db = await getDatabase();

      const listCollection = db.collection<ListSchema>('lists');

      const list = {
        name,
        items: [],
        createdAt: Date.now(),
      };

      const entry = await listCollection.insertOne(list);

      return {
        ...list,
        id: entry.insertedId.toHexString(),
      };
    },
    getLists: async () => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

      const cursor = listCollection.find({});

      return cursor
        .map(({ _id, ...list }) => ({ ...list, id: _id.toHexString() }))
        .toArray();
    },
    addItem: async ({ listId, content, done, createdAt }) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');
      const filter = {
        _id: new ObjectId(listId),
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
      };
    },
    updateItem: async ({ listId, itemId }, itemFields) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');
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
    updateListName: async ({ listId, name }) => {
      const db = await getDatabase();

      const listCollection = db.collection<WithId<ListSchema>>('lists');

      const { value } = await listCollection.findOneAndUpdate(
        {
          _id: new ObjectId(listId),
        },
        { $set: { name } },
      );

      if (!value) {
        return null;
      }

      const { _id, ...list } = value;

      return { id: _id.toHexString(), ...list, name };
    },
  };
}

function genereteItemId(list: WithId<ListSchema>): string {
  return `${list._id.toHexString()}-${Date.now()}-${list.items.length + 1}`;
}
