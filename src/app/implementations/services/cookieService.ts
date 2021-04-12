import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

type UserPayload = { id: string };

export interface CookieService {
  saveToken: (token: string) => void;
  saveUser: (user: UserPayload) => void;
  getUser: () => UserPayload | null;
}

const TOKEN_COOKIE_NAME = 'ficdev-user-token';
const USER_COOKIE_NAME = 'ficdev-user-details';

export function cookieServiceFactory(
  req: IncomingMessage,
  res: ServerResponse,
): CookieService {
  const cookies = new Cookies(req, res, {
    keys: ['aha'],
  });

  return {
    saveToken: (token) => {
      cookies.set(TOKEN_COOKIE_NAME, token, { signed: true });
    },
    saveUser: (user) => {
      cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { signed: true });
    },
    getUser: () => {
      try {
        const cookie = cookies.get(USER_COOKIE_NAME);

        if (!cookie) {
          return null;
        }

        return JSON.parse(cookie);
      } catch (error) {
        return null;
      }
    },
  };
}
