import { authServiceFactory, cookieServiceFactory } from '@ficdev/auth-express';
import { ForbiddenError } from 'core/errors/ForbiddenError';
import { AuthService } from 'core/interfaces/services/AuthService';
import { IncomingMessage, ServerResponse } from 'http';
import { AUTH_BASE_URL } from '../../config/env';

interface Settings {
  clientId: string;
}

export function buildAppAuthServiceFactory({
  clientId,
}: Settings): ServiceFactory {
  const authService = authServiceFactory({
    clientId,
    authUrlBase: AUTH_BASE_URL,
  });

  return (req: IncomingMessage, res: ServerResponse): AuthService => ({
    async getCurrentUser() {
      const cookieService = cookieServiceFactory({});
      const token = cookieService.getToken(req, res);

      if (!token) {
        throw new ForbiddenError();
      }

      return authService.getUserDetailsByToken(token);
    },
  });
}

type ServiceFactory = (
  req: IncomingMessage,
  res: ServerResponse,
) => AuthService;
