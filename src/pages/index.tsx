import { ListEntity } from 'core/entities/List';
import { buildGetLists } from 'core/use-cases/getLists';
import { listRepository } from 'dependencies';
import { HomeScreen, Props } from 'frontend/screens/HomeScreen';
import { WelcomeScreen } from 'frontend/screens/WelcomeScreen';
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
