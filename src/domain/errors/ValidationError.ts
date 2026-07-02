import type { ZodError } from "zod";

import DomainError from "./DomainError.js";

export default class ValidationError extends DomainError {
  readonly code: string;
  public readonly issues: ZodError["issues"];

  constructor(issues: ZodError["issues"]) {
    super(`Validation failed`);
    this.code = `VALIDATION`;
    this.issues = issues;
  }

  public toJSON() {
    return {
      message: this.message,
      code: this.code,
      issues: this.issues,
    };
  }
}
