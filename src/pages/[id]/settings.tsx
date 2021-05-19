import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { appAuthServiceFactory, listRepository } from '../../app/dependencies';
import { ListSettingsScreen } from '../../app/frontend/screens/ListSettingsScreen';
import { ListEntity } from '../../core/entities/List';
import { ForbiddenError } from '../../core/errors/ForbiddenError';
import { getListByIdUsecaseFactory } from '../../core/use-cases/getListById';

const ListSettingsPage: FC<{ list: ListEntity }> = ({ list }) => {
  return <ListSettingsScreen list={list} />;
};

export default ListSettingsPage;

export const getServerSideProps: GetServerSideProps<{
  list: ListEntity;
}> = async ({ query, req, res }) => {
  try {
    const { id: queryId } = query;

    const authService = appAuthServiceFactory(req, res);
    const currentUser = await authService.getCurrentUser();

    if (!currentUser) {
      return {
        redirect: {
          destination: '/',
          permanent: true,
        },
      };
    }

    const [id] = Array.isArray(queryId) ? queryId : [queryId];

    const list = await getListByIdUsecaseFactory({
      listRepository,
    })({
      listId: id,
      user: currentUser,
    });

    if (!list) {
      return { notFound: true };
    }

    return {
      props: { list },
    };
  } catch (error) {
    if (!(error instanceof ForbiddenError)) {
      return {
        notFound: true,
      };
    }

    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
};
