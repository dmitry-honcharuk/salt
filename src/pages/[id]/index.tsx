import { ListScreen } from 'app/frontend/screens/ListScreen';
import { addItem } from 'app/frontend/services/api/addItem';
import { getListById } from 'app/frontend/services/api/getListById';
import { orderItems } from 'app/frontend/services/api/orderItems';
import { removeItem } from 'app/frontend/services/api/removeItem';
import { toggleItem } from 'app/frontend/services/api/toggleItem';
import { updateItemContent } from 'app/frontend/services/api/updateItemContent';
import { updateListName } from 'app/frontend/services/api/updateListName';
import { useEmit } from 'app/frontend/sockets/hooks/useEmit';
import { useSubscribe } from 'app/frontend/sockets/hooks/useSubscribe';
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
import produce from 'immer';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import { useRouter } from 'next/router';
import {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { LoadingScreen } from '../../app/frontend/screens/LoadingScreen';
import { cleanList } from '../../app/frontend/services/api/clean';
import { PendingItem } from '../../app/frontend/types/PendingItem';

type Props = {
  list: ListEntity;
};

const ListPageView: FunctionComponent<Props> = ({ list: initialList }) => {
  const [items, setItems] = useState(initialList.items);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [name, setName] = useState<string>(initialList.name);
  const pendingDelete = useRef<Set<string>>(new Set());
  const emit = useEmit();

  const getItemById = useCallback(
    (itemId: string) => find(items, { id: itemId }),
    [items]
  );

  const setItemById = useCallback((id: string, item: ItemEntity) => {
    setItems((items) =>
      produce(items, (draft) => {
        const index = draft.findIndex((item) => item.id === id);

        if (index === -1) {
          draft.unshift(item);
          return;
        }

        draft[index] = item;
      })
    );
  }, []);

  const deleteItemById = useCallback((id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  }, []);

  useSubscribe<ItemAddedEvent>(
    TOPICS.ITEM_ADDED,
    useCallback(
      ({ listId, item }) => {
        if (listId !== initialList.id) {
          return;
        }

        setItemById(item.id, item);
      },
      [initialList.id, setItemById]
    )
  );

  useSubscribe<ItemToggledEvent>(
    TOPICS.ITEM_TOGGLED,
    useCallback(
      ({ listId, itemId, done }) => {
        if (listId !== initialList.id) {
          return;
        }

        const item = getItemById(itemId);

        if (!item) {
          return;
        }

        setItemById(item.id, { ...item, done });
      },
      [getItemById, initialList.id, setItemById]
    )
  );

  useSubscribe<ItemContentChangedEvent>(
    TOPICS.ITEM_CONTENT_CHANGED,
    useCallback(
      ({ listId, itemId, content }) => {
        if (listId !== initialList.id) {
          return;
        }

        const item = getItemById(itemId);

        if (!item) {
          return;
        }

        setItemById(item.id, { ...item, content });
      },
      [getItemById, initialList.id, setItemById]
    )
  );

  useSubscribe<ListNameChangedEvent>(
    TOPICS.LIST_NAME_CHANGED,
    useCallback(
      ({ listId, name }) => {
        if (listId !== initialList.id) {
          return;
        }

        setName(name);
      },
      [initialList.id]
    )
  );

  useSubscribe<ItemRemovedEvent>(
    TOPICS.ITEM_REMOVED,
    useCallback(
      ({ listId, itemId }) => {
        if (listId !== initialList.id) {
          return;
        }

        const item = getItemById(itemId);

        if (!item) {
          return;
        }

        deleteItemById(item.id);
      },
      [deleteItemById, getItemById, initialList.id]
    )
  );

  type UpdateName = (options: {
    listId: string;
    name: string;
  }) => Promise<void>;
  const updateName = useRef(
    debounce<UpdateName>(async ({ listId, name }) => {
      await updateListName({
        listId,
        name,
      });
      emit<ListNameChangedEvent>(TOPICS.LIST_NAME_CHANGED, {
        listId,
        name,
      });
    }, 800)
  );

  type UpdateItem = (options: {
    itemId: string;
    listId: string;
    content: string;
  }) => Promise<void>;
  const updateContent = useRef(
    debounce<UpdateItem>(async ({ itemId, listId, content }) => {
      await updateItemContent({
        itemId,
        listId,
        content,
      });
      emit<ItemContentChangedEvent>(TOPICS.ITEM_CONTENT_CHANGED, {
        itemId,
        listId,
        content,
      });
    }, 800)
  );

  if (!initialList) {
    return <LoadingScreen />;
  }

  const handleItemToggle = (itemId: string) => async () => {
    const item = getItemById(itemId);

    if (!item) {
      return;
    }

    const isDone = item.done;

    setItems((items) => [
      {
        ...item,
        done: !isDone,
        doneAt: isDone ? null : Date.now(),
      },
      ...items.filter(({ id }) => id !== itemId),
    ]);

    try {
      await toggleItem({ listId: initialList.id, itemId });

      emit<ItemToggledEvent>(TOPICS.ITEM_TOGGLED, {
        itemId,
        listId: initialList.id,
        done: !isDone,
      });
    } catch (error) {
      setItemById(itemId, { ...item, done: isDone });
      toast.error('Could not update');
    }
  };

  const handleContentUpdate = (id: string) => async (newContent: string) => {
    const item = getItemById(id);

    if (!item) {
      return;
    }

    setItemById(id, { ...item, content: newContent });

    try {
      await updateContent.current({
        itemId: item.id,
        listId: initialList.id,
        content: newContent,
      });
    } catch (error) {
      if (!pendingDelete.current.has(id)) {
        toast.error('Could not update');
      }
    }
  };

  const handleAddItem = async (
    params: Partial<Omit<ItemEntity, 'id'>>,
    files: File[] = []
  ) => {
    try {
      const { content = '', done = false } = params;

      const tempId = [initialList.id, Date.now(), items.length + 1].join('-');

      const pendingItem: PendingItem = {
        content,
        done,
        tempId: tempId,
      };

      setPendingItems((items) => [pendingItem, ...items]);

      const item = await addItem({
        listId: initialList.id,
        content,
        done,
        files,
      });

      setPendingItems((items) =>
        items.filter((item) => item.tempId !== tempId)
      );
      setItemById(item.id, item);

      emit<ItemAddedEvent>(TOPICS.ITEM_ADDED, {
        listId: initialList.id,
        item: item,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      toast.error('Could not create');
    }
  };

  const handleNameChange = async (newName: string) => {
    const oldName = name;

    setName(newName);

    try {
      await updateName.current({ listId: initialList.id, name: newName });
    } catch (error) {
      setName(oldName);
      toast.error('Could not update');
    }
  };

  const handleRemoveItem = (id: string) => async () => {
    const item = getItemById(id);

    if (!item) {
      return;
    }

    pendingDelete.current.add(item.id);

    deleteItemById(id);

    try {
      await removeItem({
        listId: initialList.id,
        itemId: item.id,
      });
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: initialList.id,
        itemId: item.id,
      });
    } catch (e) {
      setItemById(id, { ...item });
    }

    pendingDelete.current.delete(item.id);
  };

  const handleClean = async () => {
    const removedIds = await cleanList(initialList.id);

    if (!removedIds.length) {
      return;
    }

    setItems((items) => items.filter(({ id }) => !removedIds.includes(id)));

    for (const removedId of removedIds) {
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: initialList.id,
        itemId: removedId,
      });
    }
  };

  const updateOrder = async (order: string[]) => {
    setItems((items) =>
      [...items].sort((a, b) => {
        const aIndex = order.findIndex((id) => id === a.id);
        const bIndex = order.findIndex((id) => id === b.id);

        return aIndex - bIndex;
      })
    );

    await orderItems({
      listId: initialList.id,
      itemIds: order,
    });
  };

  return (
    <ListScreen
      listId={initialList.id}
      name={name}
      createdAt={initialList.createdAt}
      setName={handleNameChange}
      items={items}
      pendingItems={pendingItems}
      toggleItem={handleItemToggle}
      updateContent={handleContentUpdate}
      addItem={handleAddItem}
      removeItem={handleRemoveItem}
      creatorId={initialList.creator.id}
      clean={handleClean}
      handleOrderChange={updateOrder}
    />
  );
};

export default function ListPage(): ReactElement {
  const {
    query: { id: queryId },
  } = useRouter();

  const [listId] = Array.isArray(queryId) ? queryId : [queryId];

  const [list, setList] = useState<ListEntity | null>(null);

  useEffect(() => {
    if (!listId) {
      return;
    }

    getListById({ listId }).then((list) => {
      if (!list) {
        return;
      }

      setList(list);
    });
  }, [listId]);

  if (!list) {
    return <LoadingScreen />;
  }

  return <ListPageView list={list} />;
}
