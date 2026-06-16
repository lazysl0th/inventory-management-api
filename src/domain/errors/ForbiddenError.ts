import DomainError from "./DomainError.js";

export default class ForbiddenError extends DomainError {
  readonly code: string;

  constructor() {
    super(`Access denied`);
    this.code = `FORBIDDEN`;
  }
}
