import { Db, MongoClient } from 'mongodb';
import { CONNECTION_URL } from './connectionUrl';

let cachedConnection: Db | null = null;

export async function getDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const client = new MongoClient(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  const database = client.db(process.env.DB_NAME);

  cachedConnection = database;

  return database;
}
