import { UserEntity } from 'core/entities/User';
import 'styled-components';

declare module 'next' {
  interface NextApiRequest {
    user?: UserEntity;
  }
}
