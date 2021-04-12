import { FC } from 'react';
import { AuthScreen, Type } from '../app/frontend/screens/AuthScreen';

const Register: FC = () => {
  return <AuthScreen type={Type.Register} />;
};

export default Register;
