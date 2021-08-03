import { authorizedMiddlewareFactory } from '@ficdev/auth-express';
import { buildMongoListRepository } from 'app/implementations/repositories/mongo/ListRepository';
import { NEXT_PUBLIC_AUTH_BASE_URL, NEXT_PUBLIC_AUTH_CLIENT_ID } from './config/env';

export const listRepository = buildMongoListRepository();
export const authorized = authorizedMiddlewareFactory({
  clientId: NEXT_PUBLIC_AUTH_CLIENT_ID,
  authUrlBase: NEXT_PUBLIC_AUTH_BASE_URL,
});
