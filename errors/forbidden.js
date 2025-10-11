import { response } from '../constants.js';
const { FORBIDDEN } = response;

export default class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN.statusCode;
  }
}