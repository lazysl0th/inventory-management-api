import jwt from 'jsonwebtoken';
import Forbidden from '../errors/forbidden.js'
import config from '../config.js';
import { response, roles } from '../constants.js';

const { FORBIDDEN, INSUFFICIENT_PERMISSION } = response;
const { JWT_SECRET } = config;

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new Forbidden(FORBIDDEN.text);

  const token = authHeader.split(' ')[1];

  if (!token) throw new Forbidden(FORBIDDEN.text);
  
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Forbidden(FORBIDDEN.text);
  }
  req.user = payload;
  return next();
};

export const authRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) throw new Forbidden(INSUFFICIENT_PERMISSION.text);
  return next();
};