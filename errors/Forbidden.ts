import { FORBIDDEN } from '../constants/response.js';
import type { IError } from '../types/base/Error.js';

export default class Forbidden extends Error implements IError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN.STATUS_CODE;
  }
}