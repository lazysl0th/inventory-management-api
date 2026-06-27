import type { Request, Response, NextFunction } from "express";
import type DomainError from "#/domain/errors/DomainError.js";

export default (
  e: DomainError | Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(e);

  if (res.headersSent) return next(e);

  const statusCode = 500;

  const message = e.message || "INTERNAL_SERVER_ERROR.TEXT";

  res.status(statusCode).json({ message });
};
