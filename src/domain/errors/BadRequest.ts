import { BAD_REQUEST } from "../../constants/response.js";
import type { IError } from "../../types/base/Error.js";

export default class BadRequest extends Error implements IError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST.STATUS_CODE;
  }
}
