import response from '../constants.js';
const { BAD_REQUEST } = response;

export default class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST.statusCode;
  }
}