import { FC, useEffect, useState } from 'react';
import { AuthContext } from './context';
import { User } from './User';
import { clearTokenCookie, getTokenCookie } from './utils/cookies';
import { getAuthorizeApiUrl } from './utils/url';

interface Props {
  clientId: string;
  audience: string;
}

export const AuthProvider: FC<Props> = ({ clientId, audience, children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getTokenCookie();

    if (!user && token) {
      const headers = new Headers();

      headers.append('authorization', `Bearer ${token}`);

      fetch(getAuthorizeApiUrl({ clientId }), { headers })
        .then((res) => {
          if (res.status < 400) {
            return res.json();
          }

          throw new Error();
        })
        .then(setUser)
        .catch(() => clearTokenCookie());
    }
  }, [clientId, user]);

  return (
    <AuthContext.Provider
      value={{
        clientId,
        audience,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
