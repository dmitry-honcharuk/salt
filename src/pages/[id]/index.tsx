import { useAuth } from '@ficdev/auth-react';
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
import { Dictionary } from 'lodash';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import _ from 'lodash/fp';
import _omitBy from 'lodash/fp/omitBy';
import keyBy from 'lodash/keyBy';
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

const ListPageView: FunctionComponent<Props> = ({ list: rawList }) => {
  const [list, setList] = useState(rawList);
  const [itemDict, setItemDict] = useState<Dictionary<ItemEntity>>(
    keyBy(
      list.items.map((item) => ({ ...item, displayId: item.id })),
      'displayId',
    ),
  );
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [name, setName] = useState<string>(list.name);
  const emit = useEmit();

  const setItemById = useCallback(
    (id: string, item: ItemEntity) => {
      setItemDict((dict) => ({ ...dict, [id]: item }));
    },
    [setItemDict],
  );

  const deleteItemById = useCallback(
    (id: string) => {
      setItemDict((dict) => {
        return produce(dict, (draft) => {
          delete draft[id];

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
        if (listId !== list.id) {
          return;
        }

        setItemById(item.id, item);
      },
      [list.id, setItemById],
    ),
  );

  useSubscribe<ItemToggledEvent>(
    TOPICS.ITEM_TOGGLED,
    useCallback(
      ({ listId, itemId, done }) => {
        if (listId !== list.id) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        setItemById(item.id, { ...item, done });
      },
      [itemDict, list.id, setItemById],
    ),
  );

  useSubscribe<ItemContentChangedEvent>(
    TOPICS.ITEM_CONTENT_CHANGED,
    useCallback(
      ({ listId, itemId, content }) => {
        if (listId !== list.id) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        setItemById(item.id, { ...item, content });
      },
      [itemDict, list.id, setItemById],
    ),
  );

  useSubscribe<ListNameChangedEvent>(
    TOPICS.LIST_NAME_CHANGED,
    useCallback(
      ({ listId, name }) => {
        if (listId !== list.id) {
          return;
        }

        setName(name);
      },
      [list.id],
    ),
  );

  useSubscribe<ItemRemovedEvent>(
    TOPICS.ITEM_REMOVED,
    useCallback(
      ({ listId, itemId }) => {
        if (listId !== list.id) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        deleteItemById(item.id);
      },
      [deleteItemById, itemDict, list.id],
    ),
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
    }, 800),
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
    }, 800),
  );

  const { user: currentUser } = useAuth();

  if (!list) {
    return <LoadingScreen />;
  }

  const handleItemToggle = (itemId: string) => async () => {
    const item = itemDict[itemId];

    if (!item) {
      return;
    }

    const isDone = item.done;

    setItemById(itemId, { ...item, done: !isDone });

    try {
      await toggleItem({ listId: list.id, itemId });

      emit<ItemToggledEvent>(TOPICS.ITEM_TOGGLED, {
        itemId,
        listId: list.id,
        done: !isDone,
      });
    } catch (error) {
      setItemById(itemId, { ...item, done: isDone });
      toast.error('Could not update');
    }
  };

  const handleContentUpdate =
    (displayId: string) => async (newContent: string) => {
      const item = itemDict[displayId];
      const itemId = item.id;

      if (!item || !itemId) {
        return;
      }

      setItemById(displayId, { ...item, content: newContent });

      try {
        await updateContent.current({
          itemId,
          listId: list.id,
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

      const tempId = [
        list.id,
        Date.now(),
        Object.keys(itemDict).length + 1,
      ].join('-');

      const pendingItem: PendingItem = {
        content,
        done,
        tempId: tempId,
      };

      setPendingItems((items) => [pendingItem, ...items]);

      const item = await addItem({ listId: list.id, content, done });

      setPendingItems((items) =>
        items.filter((item) => item.tempId !== tempId),
      );
      setItemById(item.id, item);

      const newList = produce(list as ListEntity, (draft) => {
        if (!currentUser) {
          return;
        }

        draft.order = draft.order ?? {};
        draft.order[currentUser.id] = [
          item.id,
          ...(draft.order[currentUser.id] || []),
        ];
      });

      setList(newList);

      emit<ItemAddedEvent>(TOPICS.ITEM_ADDED, {
        listId: list.id,
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
      await updateName.current({ listId: list.id, name: newName });
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

    deleteItemById(displayId);

    try {
      await removeItem({
        listId: list.id,
        itemId,
      });
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: list.id,
        itemId,
      });
    } catch (e) {
      setItemById(displayId, { ...item });
    }
  };

  const handleClean = async () => {
    const removedIds = await cleanList(list.id);

    if (!removedIds.length) {
      return;
    }

    setItemDict(_omitBy<ItemEntity>(({ id }) => id && removedIds.includes(id)));

    for (const removedId of removedIds) {
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: list.id,
        itemId: removedId,
      });
    }
  };

  const itemsOrder =
    (currentUser?.id ? list.order?.[currentUser.id] : []) ?? [];

  const orderedItems = _.pipe<[string[]], (ItemEntity | null)[], ItemEntity[]>(
    _.map((id) => itemDict[id]),
    _.filter(_.negate(_.isNil)),
  )(itemsOrder);

  const unorderedItems = _.pipe<
    [Dictionary<ItemEntity>],
    ItemEntity[],
    ItemEntity[],
    ItemEntity[]
  >(
    _.values,
    _.filter((item) => !itemsOrder.includes(item.id)),
    _.orderBy<ItemEntity>(['done', 'id'])(['asc', 'desc']),
  )(itemDict);

  const items = [...orderedItems, ...unorderedItems];

  const updateOrder = async (order: string[]) => {
    if (!currentUser?.id) {
      return;
    }

    const newList = produce(list as ListEntity, (draft) => {
      draft.order = draft.order ?? {};
      draft.order[currentUser.id] = order;
    });

    setList(newList);

    await orderItems({
      listId: list.id,
      itemIds: order,
    });
  };

  return (
    <ListScreen
      listId={list.id}
      name={name}
      createdAt={list.createdAt}
      setName={handleNameChange}
      items={items}
      pendingItems={pendingItems}
      toggleItem={handleItemToggle}
      updateContent={handleContentUpdate}
      addItem={handleAddItem}
      removeItem={handleRemoveItem}
      creatorId={list.creator.id}
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
