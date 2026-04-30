import { CONFLICT } from '../constants/response.js';
import type { IError } from '../types/base/Error.js';

export default class Conflict extends Error implements IError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT.STATUS_CODE;
  }
}