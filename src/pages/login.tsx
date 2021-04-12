import { FC } from 'react';
import { AuthScreen, Type } from '../app/frontend/screens/AuthScreen';

const Login: FC = () => {
  return <AuthScreen type={Type.Login} />;
};

export default Login;
