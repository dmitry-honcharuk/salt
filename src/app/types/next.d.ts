import { User } from '@ficdev/auth-express';
import 'styled-components';

declare module 'next' {
  interface NextApiRequest {
    user?: User;
  }
}
