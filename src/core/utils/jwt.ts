import { sign, verify } from 'jsonwebtoken';
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

export function verifyShareToken(token: string): Promise<Payload> {
  return new Promise<Payload>((resolve, reject) => {
    verify(token, SHARE_TOKEN_SECRET ,(err, payload) => {
      if (err) {
        reject(err);
        return;
      }

      if(!payload) {
        reject(new Error('No payload was received'));
        return;
      }

      resolve(payload as Payload);
    });
  });
}

type Payload = {
  listId: string;
};
