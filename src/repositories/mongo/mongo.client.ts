import { Db, MongoClient } from 'mongodb';
import { CONNECTION_URL } from './connectionUrl';

export async function onConnection<T>(
  cb: (client: Db) => Promise<T>,
): Promise<T> {
  const client = new MongoClient(CONNECTION_URL);

  await client.connect();

  const database = client.db(process.env.DB_NAME);

  const result = await cb(database);

  await client.close();

  return result;
}
