import DomainError from "./DomainError.js";

export default class InvalidCredentialsError extends DomainError {
  readonly code: string;

  constructor(message = "Incorrect email or password") {
    super(message);
    this.code = "AUTH";
  }
}
