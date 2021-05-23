import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { ListSettingsScreen } from '../../app/frontend/screens/ListSettingsScreen';
import { LoadingScreen } from '../../app/frontend/screens/LoadingScreen';
import { getListById } from '../../app/frontend/services/api/getListById';
import { ListEntity } from '../../core/entities/List';

export default function ListSettingsPage(): ReactElement {
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

  return <ListSettingsScreen list={list} />;
}
