import { buildGetLists } from 'core/use-cases/getLists';
import { listRepository } from 'dependencies';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { HomeScreen, Props } from 'screens/HomeScreen';

const Home: FunctionComponent<Props> = ({ lists }) => {
  return <HomeScreen lists={lists} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const getLists = buildGetLists({ listRepo: listRepository });

  return {
    props: {
      lists: await getLists(),
    },
  };
};
