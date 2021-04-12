import { AUTH_BASE_URL, AUTH_CLIENT_ID } from 'app/config/env';
import { get, post } from 'app/implementations/services/request-client';
import { AuthError } from 'core/errors/AuthError';
import { AuthService } from 'core/interfaces/services/AuthService';
import { CookieService } from './cookieService';

export function authServiceFactory(cookieService: CookieService): AuthService {
  return {
    async getUserDetailsByToken(token: string): Promise<{ id: string } | null> {
      const headers = new Headers();

      headers.append('authorization', `Bearer ${token}`);

      try {
        return await get<{ id: string }>(
          `${AUTH_BASE_URL}/api/${AUTH_CLIENT_ID}/authorize`,
          {
            headers,
          },
        );
      } catch (error) {
        console.log(error);
        throw new AuthError();
      }
    },
    async login(input): Promise<string | AuthError> {
      try {
        const { token } = await post<{ token: string }>(
          `${AUTH_BASE_URL}/api/${AUTH_CLIENT_ID}/login`,
          input,
        );

        return token;
      } catch (error) {
        throw new AuthError();
      }
    },
    async register(input): Promise<string | AuthError> {
      try {
        const { token } = await post<{ token: string }>(
          `${AUTH_BASE_URL}/api/${AUTH_CLIENT_ID}/register`,
          input,
        );

        return token;
      } catch (error) {
        throw new AuthError();
      }
    },
    async authorizeUser({ user, token }) {
      cookieService.saveToken(token);
      cookieService.saveUser(user);
    },
    async getCurrentUser() {
      return cookieService.getUser();
    },
  };
}
