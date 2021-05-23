import { HomeScreen, Props } from 'app/frontend/screens/HomeScreen';
import { ListEntity } from 'core/entities/List';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { LoadingScreen } from '../app/frontend/screens/LoadingScreen';
import { WelcomeScreen } from '../app/frontend/screens/WelcomeScreen';
import { getLists } from '../app/frontend/services/api/getLists';

const Dashboard: FunctionComponent<Props> = () => {
  const [lists, setLists] = useState<ListEntity[]>([]);
  const pendingRef = useRef(true);

  useEffect(() => {
    getLists().then((r) => {
      pendingRef.current = false;
      setLists(r);
    });
  }, []);

  if (pendingRef.current) {
    return <LoadingScreen />;
  }

  if (!lists.length) {
    return <WelcomeScreen />;
  }

  return <HomeScreen lists={lists} />;
};

export default Dashboard;
