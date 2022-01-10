import { authorizedMiddlewareFactory } from '@ficdev/auth-express';
import { buildMongoListRepository } from 'app/implementations/repositories/mongo/ListRepository';
import {
  NEXT_PUBLIC_AUTH_BASE_URL,
  NEXT_PUBLIC_AUTH_CLIENT_ID,
} from './config/env';
import { s3 } from './implementations/services/s3';
import { S3FileStorage } from './implementations/services/s3.file-storage';

export const listRepository = buildMongoListRepository();
export const authorized = authorizedMiddlewareFactory({
  clientId: NEXT_PUBLIC_AUTH_CLIENT_ID,
  authUrlBase: NEXT_PUBLIC_AUTH_BASE_URL,
});

export const s3FileStorage = new S3FileStorage(s3);
