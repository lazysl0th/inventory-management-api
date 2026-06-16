import type { Request, Response } from "express";
import type { TSafeUserWithRoles } from "../models/User.js";
import type { IAuthTokens } from "../services/Auth.js";

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
  user: TSafeUserWithRoles;
  authInfo: IAuthTokens;
  file?: Express.Multer.File;
}
