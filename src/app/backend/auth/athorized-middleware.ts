import { NextFunction, Request, Response } from 'express';
import { authServiceFactory } from './authService';
import { cookieServiceFactory } from './cookieService';
import { User } from './interfaces/User';

interface Settings {
  clientId: string;
}

interface ExtendedRequest extends Request {
  user?: User;
}

export function authorizedMiddlewareFactory({ clientId }: Settings) {
  return () => (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const cookieService = cookieServiceFactory(req, res);
    const authService = authServiceFactory({ clientId });

    const token = cookieService.getToken();

    if (!token) {
      res.status(401).end();
      return;
    }

    authService
      .getUserDetailsByToken(token)
      .then((user) => {
        if (!user) {
          res.status(401).end();
          return;
        }

        req.user = user;

        next();
      })
      .catch(() => {
        res.status(401).end();
        return;
      });
  };
}
