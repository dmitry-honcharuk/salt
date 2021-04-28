import { appAuthServiceFactory } from 'app/dependencies';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import { AuthenticateScreen } from '../app/frontend/screens/AuthenticateScreen';
import { ForbiddenError } from '../core/errors/ForbiddenError';

const Home: FunctionComponent = () => {
  return <AuthenticateScreen />;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const authService = appAuthServiceFactory(req, res);

  try {
    const currentUser = await authService.getCurrentUser();

    if (currentUser) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: true,
        },
      };
    }
  } catch (error) {
    if (!(error instanceof ForbiddenError)) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};
