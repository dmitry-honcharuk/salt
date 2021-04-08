import { AuthError } from 'core/errors/AuthError';
import { AuthService } from 'core/interfaces/services/AuthService';
import { CookieService } from './cookieService';

export function authServiceFactory(cookieService: CookieService): AuthService {
  return {
    async getUserDetailsByToken(token: string): Promise<{ id: string } | null> {
      return { id: 'user_id' };
    },
    async login(input): Promise<string | AuthError> {
      return `token`;
    },
    async register(input): Promise<string | AuthError> {
      return `token`;
    },
    async authorizeUser({ user, token }) {
      cookieService.saveToken(token);
      cookieService.saveUser(user);
    },
  };
}
