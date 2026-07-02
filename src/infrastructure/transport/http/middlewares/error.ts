import type { ErrorRequestHandler } from "express";

import { ZodError } from "zod";

import DomainError from "#/domain/errors/DomainError.js";
import ValidationError from "#/domain/errors/ValidationError.js";
import HttpStatusCode from "../constants/httpStatusCode.js";
import httpResponseMap from "../constants/responses.js";

const errorsHandler: ErrorRequestHandler = (e, _, res, next) => {
  console.log(e);

  if (res.headersSent) {
    next(e);
    return;
  }

  if (e instanceof ZodError) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json(new ValidationError(e.issues));
  }

  if (e instanceof DomainError) {
    const meta = httpResponseMap[e.code];

    if (meta) {
      res.status(meta.status).send({
        error: e.code,
        i18nKey: meta.i18nKey,
      });
      return;
    }
  }

  res.status(HttpStatusCode.InternalServerError).send({
    error: "INTERNAL_SERVER_ERROR",
    i18nKey: "errors.system.internal",
  });
};

export default errorsHandler;
