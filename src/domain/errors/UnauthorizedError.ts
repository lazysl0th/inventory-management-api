import DomainError from "./DomainError.js";

export default class UnauthorizedError extends DomainError {
  readonly code: string;

  constructor(message = "Authorization required") {
    super(message);
    this.code = `UNAUTHORIZED`;
  }
}
