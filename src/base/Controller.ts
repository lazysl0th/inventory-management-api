import type { Handler, NextFunction, Response } from "express";
import type {
  ExtendedRequest,
  HandlerController,
} from "../types/base/Controller.js";
import jwt from "jsonwebtoken";
import type { IError } from "../types/base/Error.js";
import { isIError } from "../utils.js";
import { BAD_REQUEST, CONFLICT, FORBIDDEN, OK } from "../constants/response.js";
import { PrismaClientKnownRequestError } from "#/infrastructure/persistence/prisma/generated/internal/prismaNamespace.js";
import Conflict from "#/domain/errors/Conflict.js";
import BadRequest from "#/domain/errors/BadRequest.js";
import Forbidden from "#/domain/errors/Forbidden.js";

export abstract class Controller {
  protected handle<TParams = object, TBody = object, TQuery = object>(
    handler: HandlerController<TParams, TBody, TQuery>,
  ): Handler {
    return async (req, res, next) => {
      try {
        await handler(req as ExtendedRequest<TParams, TBody, TQuery>, res);
      } catch (e) {
        if (res.headersSent) return next(e);
        this.handleError(e, next);
      }
    };
  }

  protected handleError(e: unknown, next: NextFunction): void {
    console.log(e);
    let err: IError;
    if (e instanceof PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          err = new Conflict(CONFLICT.TEXT_USER);
          break;
        case "P2025":
          err = new Conflict(CONFLICT.TEXT_INVENTORY);
          break;
        default:
          err = new BadRequest(BAD_REQUEST.TEXT);
      }
    } else if (e instanceof jwt.JsonWebTokenError) {
      err = new Forbidden(FORBIDDEN.TEXT);
    } else if (isIError(e)) {
      err = e;
    } else {
      next(e);
      return;
    }
    next(err);
  }

  private _send<T>(res: Response, data: T, statusCode: number): void {
    res.status(statusCode).json(data);
  }

  protected setCookie(
    res: Response,
    cookieName: string,
    cookieValue: string,
  ): void {
    res.cookie(cookieName, cookieValue, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  protected deleteCookie(res: Response, cookieName: string): void {
    res.clearCookie(cookieName);
  }

  protected ok<T>(res: Response, data: T): void {
    this._send(res, data, OK.STATUS_CODE);
  }

  protected created<T>(res: Response, data: T): void {
    this._send(res, data, OK.STATUS_CODE);
  }

  protected redirect(res: Response, url: string, token: string): void {
    res.redirect(`${url}/?authToken=${token}`);
  }
}
