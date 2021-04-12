import { AuthError } from 'core/errors/AuthError';

export interface AuthService {
  login: (input: {
    email: string;
    password: string;
  }) => Promise<string | AuthError>;
  register: (input: {
    email: string;
    password: string;
  }) => Promise<string | AuthError>;
  getUserDetailsByToken(token: string): Promise<{ id: string } | null>;
  authorizeUser(input: { user: { id: string }; token: string }): Promise<void>;
  getCurrentUser(): Promise<{ id: string } | null>;
}
