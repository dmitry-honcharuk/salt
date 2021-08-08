import { useAuth } from '@ficdev/auth-react';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect } from 'react';
import { AuthenticateScreen } from '../app/frontend/screens/AuthenticateScreen';
import { LoadingScreen } from '../app/frontend/screens/LoadingScreen';

const Home: FunctionComponent = () => {
  const { user, isFulfilled } = useAuth();
  const { push } = useRouter();
  console.log('HOME');

  useEffect(() => {
    if (isFulfilled && user) {
      push('/dashboard');
    }
  }, [isFulfilled, push, user]);

  if (isFulfilled && !user) {
    return <AuthenticateScreen />;
  }

  return <LoadingScreen />;
};

export default Home;
