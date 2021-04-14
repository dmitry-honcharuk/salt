import { appAuthServiceFactory, listRepository } from 'app/dependencies';
import { HomeScreen, Props } from 'app/frontend/screens/HomeScreen';
import { WelcomeScreen } from 'app/frontend/screens/WelcomeScreen';
import { ListEntity } from 'core/entities/List';
import { getListsUsecaseFactory } from 'core/use-cases/getLists';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { ForbiddenError } from '../core/errors/ForbiddenError';

const Home: FunctionComponent<Props> = ({ lists }) => {
  if (!lists.length) {
    return <WelcomeScreen />;
  }

  return <HomeScreen lists={lists} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps<{
  lists: ListEntity[];
}> = async ({ req, res }) => {
  try {
    const authService = appAuthServiceFactory(req, res);

    const getLists = getListsUsecaseFactory({
      listRepository,
      authService,
    });

    const lists = await getLists();

    return {
      props: { lists },
    };
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return {
        props: { lists: [] },
        redirect: {
          destination: '/login',
        },
      };
    }

    return {
      notFound: true,
    };
  }
};
