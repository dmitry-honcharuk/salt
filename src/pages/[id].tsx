import { List } from 'core/entities/List';
import { buildGetListById } from 'core/use-cases/getListById';
import { listRepository } from 'dependencies';
import { ListScreen } from 'frontend/screens/ListScreen';
import { GetServerSideProps } from 'next';
import { FunctionComponent, useState } from 'react';

const ListPage: FunctionComponent<{ list: List }> = ({ list: rawList }) => {
  const [list, setList] = useState(rawList);

  const toggleItem = (id: string) => () => {
    setList((l) => ({
      ...l,
      items: l.items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    }));
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
      toggleItem={toggleItem}
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
    const list = await buildGetListById({ listRepo: listRepository })({ id });

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
