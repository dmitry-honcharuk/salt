import { FC } from 'react';
import { NEXT_PUBLIC_AUTH_CLIENT_ID } from '../app/config/env';
import { AuthProvider } from '../app/frontend/auth';
import { AuthScreen, Type } from '../app/frontend/screens/AuthScreen';

const Login: FC = () => {
  return (
    <AuthProvider
      clientId={NEXT_PUBLIC_AUTH_CLIENT_ID}
      audience='http://localhost:3000/auth-test'
    >
      <AuthScreen type={Type.Login} />
    </AuthProvider>
  );
};

export default Login;
