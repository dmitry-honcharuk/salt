import { authorizedMiddlewareFactory } from '@ficdev/auth-express';
import { buildMongoListRepository } from 'app/implementations/repositories/mongo/ListRepository';
import { NEXT_PUBLIC_AUTH_BASE_URL, NEXT_PUBLIC_AUTH_CLIENT_ID } from './config/env';
import { buildAppAuthServiceFactory } from './implementations/services/appAuthService';

export const listRepository = buildMongoListRepository();
export const appAuthServiceFactory = buildAppAuthServiceFactory({
  clientId: NEXT_PUBLIC_AUTH_CLIENT_ID,
});
export const authorized = authorizedMiddlewareFactory({
  clientId: NEXT_PUBLIC_AUTH_CLIENT_ID,
  authUrlBase: NEXT_PUBLIC_AUTH_BASE_URL,
});
