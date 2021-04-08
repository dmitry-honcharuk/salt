import { listRepository } from 'app/dependencies';
import { HomeScreen, Props } from 'app/frontend/screens/HomeScreen';
import { WelcomeScreen } from 'app/frontend/screens/WelcomeScreen';
import { ListEntity } from 'core/entities/List';
import { buildGetLists } from 'core/use-cases/getLists';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

const Home: FunctionComponent<Props> = ({ lists }) => {
  if (!lists.length) {
    return <WelcomeScreen />;
  }

  return <HomeScreen lists={lists} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps<{
  lists: ListEntity[];
}> = async () => {
  const getLists = buildGetLists({ listRepository });

  const lists = await getLists();

  return {
    props: { lists },
  };
};
