import { List } from 'core/entities/List';
import { buildGetListById } from 'core/use-cases/getListById';
import { listRepository } from 'dependencies';
import { ListScreen } from 'frontend/screens/ListScreen';
import { toggleItem } from 'frontend/services/api/toggleItem';
import produce from 'immer';
import { GetServerSideProps } from 'next';
import { FunctionComponent, useState } from 'react';
import { toast } from 'react-toastify';

const ListPage: FunctionComponent<{ list: List }> = ({ list: rawList }) => {
  const [list, setList] = useState(rawList);

  const setItemDone = (itemIndex: number, done: boolean) => {
    const updatedList = produce(list, (draft) => {
      draft.items[itemIndex].done = done;
    });

    setList(updatedList);
  };

  const handleItemToggle = (id: string) => async () => {
    const itemIndex = list.items.findIndex((item) => item.id === id);
    const isDone = list.items[itemIndex].done;

    setItemDone(itemIndex, !isDone);

    try {
      await toggleItem({ listId: rawList.id, itemId: id });
    } catch (error) {
      setItemDone(itemIndex, isDone);
      toast.error('Could not update');
    }
  };

  const updateContent = (id: string) => (newContent: string) => {
    setList((l) => ({
      ...l,
      items: l.items.map((item) =>
        item.id === id ? { ...item, content: newContent } : item,
      ),
    }));
  };

  const addItem = async () => {
    setList((l) => ({
      ...l,
      items: [
        ...l.items,
        { id: `${l.items.length + 1}`, content: '', done: false },
      ],
    }));
  };

  return (
    <ListScreen
      list={list}
      toggleItem={handleItemToggle}
      updateContent={updateContent}
      addItem={addItem}
    />
  );
};

export default ListPage;

export const getServerSideProps: GetServerSideProps<{ list: List }> = async ({
  query,
}) => {
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
