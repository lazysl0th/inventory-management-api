import DomainError from "./DomainError.js";

export default class BadRequestError extends DomainError {
  readonly code: string;

  constructor() {
    super("Incorrect data provided");
    this.code = `BAD_REQUEST`;
  }
}
