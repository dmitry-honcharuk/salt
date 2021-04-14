import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useAuth } from '../auth';
import { login as loginUser } from '../services/api/login';
import { register as registerUser } from '../services/api/register';

export enum Type {
  Login = 'login',
  Register = 'register',
}

export const AuthScreen: FC<{ type: Type }> = ({ type }) => {
  const { push } = useRouter();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm<{
    email: string;
    password: string;
  }>();
  const { authorizeWithRedirect, user, logout } = useAuth();

  const isLogin = type === Type.Login;

  const finalError = error || errors.email?.message || errors.password?.message;

  return (
    <Root>
      <div>
        <span>USER: </span>
        <span>{JSON.stringify(user)}</span>
      </div>
      <form
        onSubmit={handleSubmit(async ({ email, password }) => {
          try {
            const authorize = isLogin ? loginUser : registerUser;

            await authorize({ email, password });
            setError(null);
            await push('/');
          } catch (e) {
            setError(e.message);
          }
        })}
      >
        <input
          type='email'
          id='email'
          {...register('email', { required: true })}
        />
        <input
          type='password'
          id='password'
          {...register('password', { required: true })}
        />
        <button
          type='submit'
          disabled={isSubmitting || (isSubmitted && !isEmpty(errors))}
        >
          {isLogin ? 'Sign in' : 'Sign up'}
        </button>
        <Link href={isLogin ? '/register' : '/login'}>
          <a>{isLogin ? 'Sign up' : 'Sign in'}</a>
        </Link>
        {finalError && (
          <div>
            <pre style={{ color: 'deeppink' }}>{finalError}</pre>
          </div>
        )}
      </form>
      <button onClick={() => authorizeWithRedirect()}>Authorize</button>
      <button onClick={() => logout()}>Logout</button>
    </Root>
  );
};

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Root = styled(Centered)`
  height: 100vh;
`;
