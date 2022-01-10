import AWS from 'aws-sdk';
import { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } from '../../config/env';

export const s3 = new AWS.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  endpoint: new AWS.Endpoint('fra1.digitaloceanspaces.com'),
});
