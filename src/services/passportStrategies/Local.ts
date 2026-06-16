import {
  Strategy,
  type IStrategyOptionsWithRequest,
  type VerifyFunctionWithRequest,
} from "passport-local";
import type { IStrategy } from "../../types/base/Passport.js";
import type {
  IAuthResultData,
  IAuthService,
} from "../../types/services/Auth.js";
import Passport from "../../base/Passport.js";

export default class LocalStrategy
  extends Passport
  implements IStrategy<Strategy>
{
  readonly strategy: Strategy;
  private readonly options: IStrategyOptionsWithRequest;

  constructor(private readonly authService: IAuthService) {
    super();
    this.options = {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    };
    this.strategy = new Strategy(this.options, this.verify);
  }

  verify: VerifyFunctionWithRequest = (req, username, password, done) => {
    const remember = req.body.remember;
    this.verifyHandle<IAuthResultData>(
      async () =>
        await this.authService.loginUserByEmail({
          email: username,
          password: password,
          remember,
        }),
      done,
    );
  };
}
