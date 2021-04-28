import { DB_NAME, DB_PASSWORD, DB_USERNAME } from '../../../config/env';

export const CONNECTION_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@salt.3okfj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
