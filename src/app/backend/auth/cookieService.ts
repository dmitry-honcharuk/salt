import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';
import { TOKEN_COOKIE_NAME } from './constants';

export interface CookieService {
  getToken: () => string | undefined;
}

export function cookieServiceFactory(
  req: IncomingMessage,
  res: ServerResponse,
): CookieService {
  const cookies = new Cookies(req, res, {
    keys: ['aha'],
  });

  return {
    getToken: () => cookies.get(TOKEN_COOKIE_NAME),
  };
}
