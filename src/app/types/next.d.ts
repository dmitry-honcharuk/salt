import { User } from '@ficdev/auth-express';
import 'styled-components';
import { UploadedFile } from './uploadedFile';

declare module 'next' {
  interface NextApiRequest {
    user?: User;
    file?: UploadedFile;
    files?:
      | {
          [fieldnamFileng]: UploadedFile;
        }
      | UploadedFile[];
  }
}
