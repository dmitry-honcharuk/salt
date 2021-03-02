export class CoreError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CoreError.prototype);

    this.name = this.constructor.name;
    this.stack = new Error().stack;
  }
}
