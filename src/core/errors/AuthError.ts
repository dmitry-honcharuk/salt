import { CoreError } from './CoreError';

export class AuthError extends CoreError {
  constructor(message = 'Auth error') {
    super(message);
    Object.setPrototypeOf(this, AuthError.prototype);

    this.name = this.constructor.name;
    this.stack = new Error().stack;
  }
}
