import { authServiceFactory, cookieServiceFactory } from 'app/backend/auth';
import { ForbiddenError } from 'core/errors/ForbiddenError';
import { AuthService } from 'core/interfaces/services/AuthService';
import { IncomingMessage, ServerResponse } from 'http';

interface Settings {
  clientId: string;
}

export function buildAppAuthServiceFactory({
  clientId,
}: Settings): ServiceFactory {
  const authService = authServiceFactory({ clientId });

  return (req: IncomingMessage, res: ServerResponse): AuthService => ({
    async getCurrentUser() {
      const cookieService = cookieServiceFactory(req, res);
      const token = cookieService.getToken();

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
