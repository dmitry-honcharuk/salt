import { appAuthServiceFactory, listRepository } from 'app/dependencies';
import { ListScreen } from 'app/frontend/screens/ListScreen';
import { addItem } from 'app/frontend/services/api/addItem';
import { removeItem } from 'app/frontend/services/api/removeItem';
import { removeList } from 'app/frontend/services/api/removeList';
import { toggleItem } from 'app/frontend/services/api/toggleItem';
import { updateItemContent } from 'app/frontend/services/api/updateItemContent';
import { updateListName } from 'app/frontend/services/api/updateListName';
import { useEmit } from 'app/frontend/sockets/hooks/useEmit';
import { useSubscribe } from 'app/frontend/sockets/hooks/useSubscribe';
import { DisplayableItem } from 'app/frontend/types/DisplayableItem';
import {
  ItemAddedEvent,
  ItemContentChangedEvent,
  ItemRemovedEvent,
  ItemToggledEvent,
  ListNameChangedEvent,
  TOPICS,
} from 'app/types/socket';
import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { getListByIdUsecaseFactory } from 'core/use-cases/getListById';
import produce from 'immer';
import { Dictionary } from 'lodash';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import orderBy from 'lodash/orderBy';
import values from 'lodash/values';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FunctionComponent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const ListPage: FunctionComponent<{ list: ListEntity }> = ({
  list: rawList,
}) => {
  const [itemDict, setItemDict] = useState<Dictionary<DisplayableItem>>(
    keyBy(
      rawList.items.map((item) => ({ ...item, displayId: item.id })),
      'displayId',
    ),
  );
  const [name, setName] = useState(rawList.name);

  const emit = useEmit();

  const { push } = useRouter();

  const setItemByDisplayId = useCallback(
    (displayId: string, item: DisplayableItem) => {
      setItemDict((dict) => ({ ...dict, [displayId]: item }));
    },
    [setItemDict],
  );

  const deleteItemByDisplayId = useCallback(
    (displayId: string) => {
      setItemDict((dict) => {
        return produce(dict, (draft) => {
          delete draft[displayId];

          return draft;
        });
      });
    },
    [setItemDict],
  );

  useSubscribe<ItemAddedEvent>(
    TOPICS.ITEM_ADDED,
    useCallback(
      ({ listId, item }) => {
        if (listId !== rawList.id) {
          return;
        }

        setItemByDisplayId(item.id, { ...item, displayId: item.id });
      },
      [rawList.id, setItemByDisplayId],
    ),
  );

  useSubscribe<ItemToggledEvent>(
    TOPICS.ITEM_TOGGLED,
    useCallback(
      ({ listId, itemId, done }) => {
        if (listId !== rawList.id) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        setItemByDisplayId(item.displayId, { ...item, done });
      },
      [itemDict, rawList.id, setItemByDisplayId],
    ),
  );

  useSubscribe<ItemContentChangedEvent>(
    TOPICS.ITEM_CONTENT_CHANGED,
    useCallback(
      ({ listId, itemId, content }) => {
        if (listId !== rawList.id) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        setItemByDisplayId(item.displayId, { ...item, content });
      },
      [itemDict, rawList.id, setItemByDisplayId],
    ),
  );

  useSubscribe<ListNameChangedEvent>(
    TOPICS.LIST_NAME_CHANGED,
    useCallback(
      ({ listId, name }) => {
        if (listId !== rawList.id) {
          return;
        }

        setName(name);
      },
      [rawList.id],
    ),
  );

  useSubscribe<ItemRemovedEvent>(
    TOPICS.ITEM_REMOVED,
    useCallback(
      ({ listId, itemId }) => {
        if (listId !== rawList.id) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        deleteItemByDisplayId(item.displayId);
      },
      [deleteItemByDisplayId, itemDict, rawList.id],
    ),
  );

  const handleItemToggle = (displayId: string) => async () => {
    const item = itemDict[displayId];
    const itemId = item.id;

    if (!item || !itemId) {
      return;
    }

    const isDone = item.done;

    setItemByDisplayId(displayId, { ...item, done: !isDone });

    try {
      await toggleItem({ listId: rawList.id, itemId });

      emit<ItemToggledEvent>(TOPICS.ITEM_TOGGLED, {
        itemId,
        listId: rawList.id,
        done: !isDone,
      });
    } catch (error) {
      setItemByDisplayId(displayId, { ...item, done: isDone });
      toast.error('Could not update');
    }
  };

  const handleContentUpdate = (displayId: string) => async (
    newContent: string,
  ) => {
    const item = itemDict[displayId];
    const itemId = item.id;

    if (!item || !itemId) {
      return;
    }

    setItemByDisplayId(displayId, { ...item, content: newContent });

    try {
      await updateItemContent({
        itemId,
        listId: rawList.id,
        content: newContent,
      });
      emit<ItemContentChangedEvent>(TOPICS.ITEM_CONTENT_CHANGED, {
        itemId,
        listId: rawList.id,
        content: newContent,
      });
    } catch (error) {
      toast.error('Could not update');
    }
  };

  const handleAddItem = async (
    params: Partial<Omit<ItemEntity, 'id'>> = {},
  ) => {
    try {
      const { content = '', done = false } = params;

      const displayId = [
        rawList.id,
        Date.now(),
        Object.keys(itemDict).length + 1,
      ].join('-');

      setItemByDisplayId(displayId, {
        id: null,
        content,
        done,
        displayId,
        createdAt: null,
      });

      const item = await addItem({ listId: rawList.id, content, done });

      setItemByDisplayId(displayId, {
        ...item,
        displayId,
      });

      emit<ItemAddedEvent>(TOPICS.ITEM_ADDED, {
        listId: rawList.id,
        item: item,
      });
    } catch (error) {
      toast.error('Could not create');
    }
  };
  const handleNameChange = async (newName: string) => {
    const oldName = name;

    setName(newName);

    try {
      await updateListName({
        listId: rawList.id,
        name: newName,
      });
      emit<ListNameChangedEvent>(TOPICS.LIST_NAME_CHANGED, {
        listId: rawList.id,
        name: newName,
      });
    } catch (error) {
      setName(oldName);
      toast.error('Could not update');
    }
  };

  const handleRemoveItem = (displayId: string) => async () => {
    const item = itemDict[displayId];
    const itemId = item.id;

    if (!item || !itemId) {
      return;
    }

    deleteItemByDisplayId(displayId);

    try {
      await removeItem({
        listId: rawList.id,
        itemId,
      });
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: rawList.id,
        itemId,
      });
    } catch (e) {
      setItemByDisplayId(displayId, { ...item });
    }
  };

  const handleRemoveList = async () => {
    await removeList({ listId: rawList.id });
    push('/');
  };

  return (
    <ListScreen
      name={name}
      createdAt={rawList.createdAt}
      setName={handleNameChange}
      items={orderBy(values(itemDict), ['done', 'displayId'], ['asc', 'desc'])}
      toggleItem={handleItemToggle}
      updateContent={handleContentUpdate}
      addItem={handleAddItem}
      removeItem={handleRemoveItem}
      removeList={handleRemoveList}
    />
  );
};

export default ListPage;

export const getServerSideProps: GetServerSideProps<{
  list: ListEntity;
}> = async ({ query, req, res }) => {
  const { id: queryId } = query;

  const authService = appAuthServiceFactory(req, res);
  const creator = await authService.getCurrentUser();

  const [id] = Array.isArray(queryId) ? queryId : [queryId];

  try {
    const list = await getListByIdUsecaseFactory({
      listRepository,
    })({
      listId: id,
      creator,
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
