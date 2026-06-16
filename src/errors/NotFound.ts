import type { IError } from "../types/base/Error.js";
import { NOT_FOUND } from "../constants/response.js";

export default class NotFound extends Error implements IError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND.STATUS_CODE;
  }
}
