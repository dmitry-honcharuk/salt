import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { buildGetListById } from 'core/use-cases/getListById';
import { listRepository } from 'dependencies';
import { ListScreen } from 'frontend/screens/ListScreen';
import { addItem } from 'frontend/services/api/addItem';
import { toggleItem } from 'frontend/services/api/toggleItem';
import { updateItemContent } from 'frontend/services/api/updateItemContent';
import {
  ItemAddedEvent,
  ItemContentChangedEvent,
  ItemToggledEvent,
  TOPICS,
} from 'frontend/sockets/events';
import { useSubscribe } from 'frontend/sockets/hooks/useSubscribe';
import produce from 'immer';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import { GetServerSideProps } from 'next';
import { FunctionComponent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useEmit } from '../frontend/sockets/hooks/useEmit';

const ListPage: FunctionComponent<{ list: ListEntity }> = ({
  list: rawList,
}) => {
  const [itemDict, setItemDict] = useState(keyBy(rawList.items, 'id'));
  const emit = useEmit();

  const setItem = useCallback(
    (itemId: string, item: ItemEntity) => {
      setItemDict((dict) => ({ ...dict, [itemId]: item }));
    },
    [setItemDict],
  );

  const setItemDone = useCallback(
    (item: ItemEntity, done: boolean) => {
      const updatedItem = produce(item, (draft) => {
        draft.done = done;
      });

      setItem(item.id, updatedItem);
    },
    [setItem],
  );

  const setItemContent = useCallback(
    (item: ItemEntity, content: string) => {
      const updatedItem = produce(item, (draft) => {
        draft.content = content;
      });

      setItem(item.id, updatedItem);
    },
    [setItem],
  );

  useSubscribe<ItemAddedEvent>(
    TOPICS.ITEM_ADDED,
    ({ listId, item }) => {
      if (listId !== rawList.id) {
        return;
      }

      setItem(item.id, item);
    },
    [setItem],
  );

  useSubscribe<ItemToggledEvent>(
    TOPICS.ITEM_TOGGLED,
    ({ listId, itemId, done }) => {
      if (listId !== rawList.id) {
        return;
      }

      const item = itemDict[itemId];

      if (!item) {
        return;
      }

      setItemDone(item, done);
    },
    [setItemDone],
  );

  useSubscribe<ItemContentChangedEvent>(
    TOPICS.ITEM_CONTENT_CHANGED,
    ({ listId, itemId, content }) => {
      if (listId !== rawList.id) {
        return;
      }

      const item = itemDict[itemId];

      if (!item) {
        return;
      }

      setItemContent(item, content);
    },
    [setItemContent],
  );

  const handleItemToggle = (id: string) => async () => {
    const item = itemDict[id];

    if (!item) {
      return;
    }

    const isDone = item.done;

    setItemDone(item, !isDone);

    try {
      await toggleItem({ listId: rawList.id, itemId: id });
      emit<ItemToggledEvent>(TOPICS.ITEM_TOGGLED, {
        listId: rawList.id,
        itemId: id,
        done: !isDone,
      });
    } catch (error) {
      setItemDone(item, isDone);
      toast.error('Could not update');
    }
  };

  const handleContentUpdate = (id: string) => async (newContent: string) => {
    const item = itemDict[id];

    if (!item) {
      return;
    }

    setItemContent(item, newContent);

    try {
      await updateItemContent({
        listId: rawList.id,
        itemId: id,
        content: newContent,
      });
      emit<ItemContentChangedEvent>(TOPICS.ITEM_CONTENT_CHANGED, {
        listId: rawList.id,
        itemId: id,
        content: newContent,
      });
    } catch (error) {
      toast.error('Could not update');
    }
  };

  const handleAddItem = async () => {
    try {
      const item = await addItem({ listId: rawList.id, content: '' });

      setItem(item.id, item);

      emit<ItemAddedEvent>(TOPICS.ITEM_ADDED, { listId: rawList.id, item });
    } catch (error) {
      toast.error('Could not create');
    }
  };

  return (
    <ListScreen
      items={values(itemDict)}
      toggleItem={handleItemToggle}
      updateContent={handleContentUpdate}
      addItem={handleAddItem}
    />
  );
};

export default ListPage;

export const getServerSideProps: GetServerSideProps<{
  list: ListEntity;
}> = async ({ query }) => {
  const { id: queryId } = query;

  const [id] = Array.isArray(queryId) ? queryId : [queryId];

  try {
    const list = await buildGetListById({ listRepository })({
      listId: id,
    });

    if (!list) {
      return { notFound: true };
    }

    return {
      props: { list },
    };
  } catch (e) {
    return { notFound: true };
  }
};
