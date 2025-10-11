import { response } from '../constants.js'
const { CONFLICT } = response;

export default class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT.statusCode;
  }
}