import { useAuth } from '@ficdev/auth-react';
import { appAuthServiceFactory, listRepository } from 'app/dependencies';
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
import { getListByIdUsecaseFactory } from 'core/use-cases/getListById';
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
import { cleanList } from '../../app/frontend/services/api/clean';

type Props = {
  list: ListEntity;
  listId: string;
};

const ListPage: FunctionComponent<Props> = ({ list: rawList, listId }) => {
  useEffect(() => {
    getListById({ listId }).then(console.log);
  }, [listId]);

  const [itemDict, setItemDict] = useState<Dictionary<DisplayableItem>>(
    keyBy(
      rawList.items.map((item) => ({ ...item, displayId: item.id })),
      'displayId',
    ),
  );
  const [name, setName] = useState(rawList.name);

  const emit = useEmit();

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

  const handleNameChange = async (newName: string) => {
    const oldName = name;

    setName(newName);

    try {
      await updateName.current({ listId: rawList.id, name: newName });
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

  const handleClean = async () => {
    const removedIds = await cleanList(rawList.id);

    if (!removedIds.length) {
      return;
    }

    setItemDict(
      _omitBy<DisplayableItem>(({ id }) => id && removedIds.includes(id)),
    );

    for (const removedId of removedIds) {
      emit<ItemRemovedEvent>(TOPICS.ITEM_REMOVED, {
        listId: rawList.id,
        itemId: removedId,
      });
    }
  };

  const { user: currentUser } = useAuth();

  const itemsOrder =
    (currentUser?.id ? rawList.order?.[currentUser.id] : []) ?? [];

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
      listId: rawList.id,
      itemIds: order,
    });
  };

  return (
    <ListScreen
      listId={rawList.id}
      name={name}
      createdAt={rawList.createdAt}
      setName={handleNameChange}
      items={items}
      toggleItem={handleItemToggle}
      updateContent={handleContentUpdate}
      addItem={handleAddItem}
      removeItem={handleRemoveItem}
      creatorId={rawList.creator.id}
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

    const list = await getListByIdUsecaseFactory({
      listRepository,
    })({
      listId: listId,
      user: currentUser,
    });

    if (!listId || !list) {
      return { notFound: true };
    }

    return {
      props: { list, listId },
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
