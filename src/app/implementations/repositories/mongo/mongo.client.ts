/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Db, MongoClient } from 'mongodb';
import { DB_NAME } from '../../../config/env';
import { CONNECTION_URL } from './connectionUrl';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongo;

if (!cached) {
  // @ts-ignore
  cached = global.mongo = { db: null, promise: null };
}

export async function getDatabase(): Promise<Db> {
  if (cached.db) {
    return cached.db;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(CONNECTION_URL).then((client) => client.db(DB_NAME));
  }

  cached.db = await cached.promise;

  return cached.db;
}
