import { appAuthServiceFactory, listRepository } from 'app/dependencies';
import { HomeScreen, Props } from 'app/frontend/screens/HomeScreen';
import { ListEntity } from 'core/entities/List';
import { getListsUsecaseFactory } from 'core/use-cases/getLists';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { WelcomeScreen } from '../app/frontend/screens/WelcomeScreen';

const Dashboard: FunctionComponent<Props> = ({ lists }) => {
  if (!lists.length) {
    return <WelcomeScreen />;
  }

  return <HomeScreen lists={lists} />;
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps<{
  lists: ListEntity[];
}> = async ({ req, res }) => {
  try {
    const authService = appAuthServiceFactory(req, res);

    const getLists = getListsUsecaseFactory({
      listRepository,
    });

    const lists = await getLists({
      user: await authService.getCurrentUser(),
    });

    return {
      props: { lists },
    };
  } catch (e) {
    return {
      props: { lists: [] },
    };
  }
};
