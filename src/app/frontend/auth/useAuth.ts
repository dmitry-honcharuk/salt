import { useCallback, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './context';
import { User } from './User';
import { clearTokenCookie, setTokenCookie } from './utils/cookies';
import { getAuthorizePageUrl } from './utils/url';

export function useAuth(): AuthHook {
  const { clientId, audience, user, setUser, isFulfilled } = useContext(AuthContext);
  const authWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    function handleMessage({ data }: AuthMessage) {
      const message = data.ficdev_auth;

      if (message && authWindowRef.current) {
        const { auth_token, user } = message;

        setUser(user);
        setTokenCookie(auth_token);
        authWindowRef.current.close();
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setUser]);

  const authorizeWithRedirect = useCallback(() => {
    if (!audience || !clientId) {
      throw new Error('Audience and client id are required');
    }

    authWindowRef.current = window.open(
      getAuthorizePageUrl({ audience, clientId }),
    );
  }, [clientId, audience]);

  const logout = useCallback(() => {
    clearTokenCookie();
    setUser(null);
  }, [setUser]);

  return {
    authorizeWithRedirect,
    user,
    isFulfilled,
    logout,
  };
}

type AuthHook = {
  authorizeWithRedirect: () => void;
  logout: () => void;
  user: User | null;
  isFulfilled: boolean;
};

type AuthMessage = MessageEvent<{
  ficdev_auth?: {
    auth_token: string;
    user: { id: string };
  };
}>;
