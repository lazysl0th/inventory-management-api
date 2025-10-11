import { response } from '../constants.js';
const { UNAUTHORIZED } = response;

export default class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED.statusCode;
  }
}