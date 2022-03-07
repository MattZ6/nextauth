export class AuthTokenError extends Error {
  constructor() {
    super('Error with authentication token');

    this.name = this.constructor.name;
  }
}
