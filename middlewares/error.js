import { response } from '../constants.js';
const { INTERNAL_SERVER_ERROR } = response;

export default (e, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR.statusCode, message } = e;

  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR.statusCode
      ? INTERNAL_SERVER_ERROR.text
      : message,
  });
  next();
}