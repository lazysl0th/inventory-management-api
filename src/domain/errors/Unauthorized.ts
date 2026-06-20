import type { IError } from "../../types/base/Error.js";
import { UNAUTHORIZED } from "../../constants/response.js";

export default class Unauthorized extends Error implements IError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED.STATUS_CODE;
  }
}
