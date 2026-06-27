export default class Conflict extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}
