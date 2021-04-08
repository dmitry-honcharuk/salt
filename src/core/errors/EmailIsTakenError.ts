import { AuthError } from './AuthError';

export class EmailIsTakenError extends AuthError {
  constructor(message = 'Auth error') {
    super(message);
    Object.setPrototypeOf(this, EmailIsTakenError.prototype);

    this.name = this.constructor.name;
    this.stack = new Error().stack;
  }
}
