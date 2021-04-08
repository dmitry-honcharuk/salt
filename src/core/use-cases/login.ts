import { AuthError } from 'core/errors/AuthError';
import { CoreError } from 'core/errors/CoreError';
import { AuthService } from 'core/interfaces/services/AuthService';

export function loginUserFactory({ authService }: Dependencies) {
  return async ({ email, password }: Input): Promise<void> => {
    if (!email) {
      throw new CoreError('Email is required');
    }

    if (!password) {
      throw new CoreError('Password is required');
    }

    const response = await authService.login({
      email,
      password,
    });

    if (response instanceof AuthError) {
      throw response;
    }

    const user = await authService.getUserDetailsByToken(response);

    if (!user) {
      throw new CoreError('Email or password is invalid');
    }

    await authService.authorizeUser({ user, token: response });
  };
}

type Dependencies = {
  authService: AuthService;
};
type Input = {
  email: string;
  password: string;
};
