import { sign } from 'jsonwebtoken';
import { SHARE_TOKEN_SECRET } from '../../app/config/env';

export function signShareToken(payload: Payload): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    sign(payload, SHARE_TOKEN_SECRET, { expiresIn: 60 * 10 }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      if (!token) {
        reject(new Error('No token was generated'));
        return;
      }

      resolve(token);
    });
  });
}

type Payload = {
  listId: string;
};
