import { post } from 'app/frontend/services/api/client';
import { FC, useEffect } from 'react';

const Login: FC = () => {
  useEffect(() => {
    post('/api/auth/register', {
      email: 'my-email',
      password: 'my-password',
    });
  }, []);
  return <h1>Login</h1>;
};

export default Login;
