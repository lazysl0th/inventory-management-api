import DomainError from "./DomainError.js";

export default class ForbiddenError extends DomainError {
  readonly code: string;

  constructor(message = "Access denied") {
    super(message);
    this.code = `FORBIDDEN`;
  }
}
