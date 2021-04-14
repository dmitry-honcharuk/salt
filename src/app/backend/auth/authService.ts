import { AuthError } from 'core/errors/AuthError';
import { AUTH_URL_BASE } from './constants';
import { AuthService } from './interfaces/AuthService';
import { get } from './request-client';

interface Settings {
  clientId: string;
}

export function authServiceFactory({ clientId }: Settings): AuthService {
  return {
    async getUserDetailsByToken(token: string): Promise<{ id: string } | null> {
      const headers = new Headers();

      headers.append('authorization', `Bearer ${token}`);

      try {
        return await get<{ id: string }>(
          `${AUTH_URL_BASE}/api/${clientId}/authorize`,
          {
            headers,
          },
        );
      } catch (error) {
        console.log(error);
        throw new AuthError();
      }
    },
  };
}
