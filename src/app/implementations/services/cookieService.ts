import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

export interface CookieService {
  saveToken: (token: string) => void;
  saveUser: (user: { id: string }) => void;
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
  };
}
