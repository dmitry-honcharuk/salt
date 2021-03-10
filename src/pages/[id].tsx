import { ItemEntity } from 'core/entities/Item';
import { ListEntity } from 'core/entities/List';
import { buildGetListById } from 'core/use-cases/getListById';
import { listRepository } from 'dependencies';
import { ListScreen } from 'frontend/screens/ListScreen';
import { addItem } from 'frontend/services/api/addItem';
import { toggleItem } from 'frontend/services/api/toggleItem';
import { updateItemContent } from 'frontend/services/api/updateItemContent';
import produce from 'immer';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import { GetServerSideProps } from 'next';
import { FunctionComponent, useState } from 'react';
import { toast } from 'react-toastify';

const ListPage: FunctionComponent<{ list: ListEntity }> = ({
  list: rawList,
}) => {
  const [itemDict, setItemDict] = useState(keyBy(rawList.items, 'id'));

  const setItem = (itemId: string, item: ItemEntity) => {
    setItemDict((dict) => ({ ...dict, [itemId]: item }));
  };

  const setItemDone = (item: ItemEntity, done: boolean) => {
    const updatedItem = produce(item, (draft) => {
      draft.done = done;
    });

    setItem(item.id, updatedItem);
  };

  const setItemContent = (item: ItemEntity, content: string) => {
    const updatedItem = produce(item, (draft) => {
      draft.content = content;
    });

    setItem(item.id, updatedItem);
  };

  const handleItemToggle = (id: string) => async () => {
    const item = itemDict[id];

    if (!item) {
      return;
    }

    const isDone = item.done;

    setItemDone(item, !isDone);

    try {
      await toggleItem({ listId: rawList.id, itemId: id });
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
    } catch (error) {
      toast.error('Could not update');
    }
  };

  const handleAddItem = async () => {
    try {
      const item = await addItem({ listId: rawList.id, content: '' });

      setItem(item.id, item);
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
    const list = await buildGetListById({ listRepo: listRepository })({
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
