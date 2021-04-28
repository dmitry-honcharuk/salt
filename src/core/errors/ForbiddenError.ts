import { AuthError } from './AuthError';

export class ForbiddenError extends AuthError {
  constructor() {
    super('Forbidden');
    Object.setPrototypeOf(this, ForbiddenError.prototype);

    this.name = this.constructor.name;
    this.stack = new Error().stack;
  }
}
