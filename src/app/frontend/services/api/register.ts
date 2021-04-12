import { post } from 'app/implementations/services/request-client';

export function register(options: {
  email: string;
  password: string;
}): Promise<void> {
  return post('/api/auth/register', options);
}
