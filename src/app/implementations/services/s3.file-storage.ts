import { S3 } from 'aws-sdk';
import { FileStorage } from '../../../core/interfaces/services/file-storage.interface';

export class S3FileStorage implements FileStorage {
  constructor(private s3: S3) {}

  deleteObjects(keys: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.s3.deleteObjects(
        {
          Bucket: 'prod',
          Delete: {
            Objects: keys.map((key) => ({ Key: key })),
          },
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        }
      );
    });
  }
}
