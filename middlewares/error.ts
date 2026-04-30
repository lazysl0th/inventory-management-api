import type { Request, Response, NextFunction } from 'express';
import type { IError } from '../types/base/Error.js';
import { INTERNAL_SERVER_ERROR } from '../constants/response.js';

export default (e: IError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error(e);

  if (res.headersSent) return next(e);

  const statusCode = ('statusCode' in e && e.statusCode) 
    ? e.statusCode 
    : INTERNAL_SERVER_ERROR.STATUS_CODE;

  const message = e.message || INTERNAL_SERVER_ERROR.TEXT;

  res.status(statusCode).json({ message });
}