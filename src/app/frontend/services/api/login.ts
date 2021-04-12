import { post } from 'app/implementations/services/request-client';

export function login(options: {
  email: string;
  password: string;
}): Promise<void> {
  return post('/api/auth/login', options);
}
