import type { Request, Response } from "express";
import type { TSafeUserWithRoles } from "../models/User.js";
import type { IAuthTokens } from "../services/Auth.js";

export type HandlerController<TParams={}, TBody={}, TQuery={}> = (
  req: ExtendedRequest<TParams, TBody, TQuery>,
  res: Response
) => Promise<void>;

export interface ExtendedRequest<TParams={}, TBody={}, TQuery={}> extends Request<TParams, {}, TBody, TQuery> {
  user: TSafeUserWithRoles;
  authInfo: IAuthTokens;
  file?: Express.Multer.File;
}
