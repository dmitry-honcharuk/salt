import { authorizedMiddlewareFactory } from 'app/backend/auth';
import { buildMongoListRepository } from 'app/implementations/repositories/mongo/ListRepository';
import { NEXT_PUBLIC_AUTH_CLIENT_ID } from './config/env';
import { buildAppAuthServiceFactory } from './implementations/services/appAuthService';

export const listRepository = buildMongoListRepository();
export const appAuthServiceFactory = buildAppAuthServiceFactory({
  clientId: NEXT_PUBLIC_AUTH_CLIENT_ID,
});
export const authorized = authorizedMiddlewareFactory({
  clientId: NEXT_PUBLIC_AUTH_CLIENT_ID,
});
