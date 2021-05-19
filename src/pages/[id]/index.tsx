import { useAuth } from '@ficdev/auth-react';
import { appAuthServiceFactory } from 'app/dependencies';
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
import { ForbiddenError } from 'core/errors/ForbiddenError';
import produce from 'immer';
import { Dictionary } from 'lodash';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import _ from 'lodash/fp';
import _omitBy from 'lodash/fp/omitBy';
import keyBy from 'lodash/keyBy';
import { GetServerSideProps } from 'next';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { LoadingScreen } from '../../app/frontend/screens/LoadingScreen';
import { cleanList } from '../../app/frontend/services/api/clean';

type Props = {
  listId: string;
};

const ListPage: FunctionComponent<Props> = ({ listId: currentListId }) => {
  const [list, setList] = useState<ListEntity | null>(null);
  const [itemDict, setItemDict] = useState<Dictionary<DisplayableItem>>({});
  const [name, setName] = useState<string>();
  const emit = useEmit();

  useEffect(() => {
    getListById({ listId: currentListId }).then((list) => {
      if (!list) {
        return;
      }

      setList(list);
      setItemDict(
        keyBy(
          list.items.map((item) => ({ ...item, displayId: item.id })),
          'displayId',
        ),
      );
      setName(list.name);
    });
  }, [currentListId]);

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
        if (listId !== currentListId) {
          return;
        }

        setItemByDisplayId(item.id, { ...item, displayId: item.id });
      },
      [currentListId, setItemByDisplayId],
    ),
  );

  useSubscribe<ItemToggledEvent>(
    TOPICS.ITEM_TOGGLED,
    useCallback(
      ({ listId, itemId, done }) => {
        if (listId !== currentListId) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        setItemByDisplayId(item.displayId, { ...item, done });
      },
      [itemDict, currentListId, setItemByDisplayId],
    ),
  );

  useSubscribe<ItemContentChangedEvent>(
    TOPICS.ITEM_CONTENT_CHANGED,
    useCallback(
      ({ listId, itemId, content }) => {
        if (listId !== currentListId) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        setItemByDisplayId(item.displayId, { ...item, content });
      },
      [itemDict, currentListId, setItemByDisplayId],
    ),
  );

  useSubscribe<ListNameChangedEvent>(
    TOPICS.LIST_NAME_CHANGED,
    useCallback(
      ({ listId, name }) => {
        if (listId !== currentListId) {
          return;
        }

        setName(name);
      },
      [currentListId],
    ),
  );

  useSubscribe<ItemRemovedEvent>(
    TOPICS.ITEM_REMOVED,
    useCallback(
      ({ listId, itemId }) => {
        if (listId !== currentListId) {
          return;
        }

        const item = find(itemDict, { id: itemId });

        if (!item) {
          return;
        }

        deleteItemByDisplayId(item.displayId);
      },
      [deleteItemByDisplayId, itemDict, currentListId],
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

  const handleItemToggle = (displayId: string) => async () => {
    const item = itemDict[displayId];
    const itemId = item.id;

    if (!item || !itemId) {
      return;
    }

    const isDone = item.done;

    setItemByDisplayId(displayId, { ...item, done: !isDone });

    try {
      await toggleItem({ listId: currentListId, itemId });

      emit<ItemToggledEvent>(TOPICS.ITEM_TOGGLED, {
        itemId,
        listId: currentListId,
        done: !isDone,
      });
    } catch (error) {
      setItemByDisplayId(displayId, { ...item, done: isDone });
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

      setItemByDisplayId(displayId, { ...item, content: newContent });

      try {
        await updateContent.current({
          itemId,
          listId: currentListId,
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
        currentListId,
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

      const item = await addItem({ listId: currentListId, content, done });

      setItemByDisplayId(displayId, {
        ...item,
        displayId,
      });

      emit<ItemAddedEvent>(TOPICS.ITEM_ADDED, {
        listId: currentListId,
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
      await updateName.current({ listId: currentListId, name: newName });
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
        listId: currentListId,
        itemId,
      });
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: currentListId,
        itemId,
      });
    } catch (e) {
      setItemByDisplayId(displayId, { ...item });
    }
  };

  const handleClean = async () => {
    const removedIds = await cleanList(currentListId);

    if (!removedIds.length) {
      return;
    }

    setItemDict(
      _omitBy<DisplayableItem>(({ id }) => id && removedIds.includes(id)),
    );

    for (const removedId of removedIds) {
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: currentListId,
        itemId: removedId,
      });
    }
  };

  const itemsOrder =
    (currentUser?.id ? list.order?.[currentUser.id] : []) ?? [];

  const orderedItems = _.pipe<[string[]], DisplayableItem[], DisplayableItem[]>(
    _.map((id) => itemDict[id]),
    _.filter(_.negate(_.isNil)),
  )(itemsOrder);

  const unorderedItems = _.pipe<
    [Dictionary<DisplayableItem>],
    DisplayableItem[],
    DisplayableItem[],
    DisplayableItem[]
  >(
    _.values,
    _.filter((item) => !itemsOrder.includes(item.displayId)),
    _.orderBy<DisplayableItem>(['done', 'displayId'])(['asc', 'desc']),
  )(itemDict);

  const items = [...orderedItems, ...unorderedItems];

  const updateOrder = async (order: string[]) => {
    await orderItems({
      listId: currentListId,
      itemIds: order,
    });
  };

  return (
    <ListScreen
      listId={currentListId}
      name={name}
      createdAt={list.createdAt}
      setName={handleNameChange}
      items={items}
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

export default ListPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  req,
  res,
}) => {
  try {
    const { id: queryId } = query;

    const authService = appAuthServiceFactory(req, res);
    const currentUser = await authService.getCurrentUser();

    if (!currentUser) {
      return {
        redirect: {
          destination: '/',
          permanent: true,
        },
      };
    }

    const [listId] = Array.isArray(queryId) ? queryId : [queryId];

    if (!listId) {
      return { notFound: true };
    }

    return {
      props: { listId },
    };
  } catch (error) {
    if (!(error instanceof ForbiddenError)) {
      return {
        notFound: true,
      };
    }

    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
};
