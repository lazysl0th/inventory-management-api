import { response } from '../constants.js';
const { NOT_FOUND } = response;

export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND.statusCode;
  }
}