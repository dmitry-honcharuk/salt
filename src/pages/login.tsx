import { post } from 'app/implementations/services/request-client';
import { FC, useEffect } from 'react';

const Login: FC = () => {
  useEffect(() => {
    post('/api/auth/login', {
      email: 'salt-customer-1@example.com',
      password: '12345aa',
    });
  }, []);

  return <h1>Login</h1>;
};

export default Login;
