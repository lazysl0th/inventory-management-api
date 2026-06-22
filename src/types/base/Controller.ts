import type { TAuthTokens } from "#/application/auth/dtos/AuthDto.js";
import type User from "#/domain/entities/User.js";
import type { Request, Response } from "express";

export type HandlerController<
  TParams = object,
  TBody = object,
  TQuery = object,
> = (
  req: ExtendedRequest<TParams, TBody, TQuery>,
  res: Response,
) => Promise<void>;

export interface ExtendedRequest<
  TParams = object,
  TBody = object,
  TQuery = object,
> extends Request<TParams, object, TBody, TQuery> {
  user: User;
  authTokens: TAuthTokens;
  file?: Express.Multer.File;
}
