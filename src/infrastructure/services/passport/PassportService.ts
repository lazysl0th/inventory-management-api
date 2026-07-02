import type User from "#/domain/entities/User.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import type { RequestHandler } from "express";
import passport from "passport";
import { injectable } from "tsyringe";

@injectable()
export default class PassportService {
  passport: passport.PassportStatic;
  constructor() {
    this.passport = passport;
    this.passport.initialize();
  }

  jwtAuth: RequestHandler = (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (
        _: Error | null,
        user: User | false,
        info: { message?: string } | undefined,
      ) => {
        if (info || !user) {
          throw new UnauthorizedError();
        }
        req.user = user;
        next();
      },
    )(req, res, next);
  };
}
