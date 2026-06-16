import {
  Strategy,
  ExtractJwt,
  type StrategyOptionsWithoutRequest,
  type VerifyCallback,
} from "passport-jwt";
import type { IStrategy } from "../../types/base/Passport.js";
import Passport from "../../base/Passport.js";
import type { IUserService } from "../../types/services/User.js";
import type { TVerifyResultData } from "../../types/services/Auth.js";
import { CRYPTO } from "../../constants/crypto.js";

export default class JwtStrategy
  extends Passport
  implements IStrategy<Strategy>
{
  readonly strategy: Strategy;
  private readonly options: StrategyOptionsWithoutRequest;

  constructor(private readonly userService: IUserService) {
    super();
    this.options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CRYPTO.JWT_SECRET,
    };
    this.strategy = new Strategy(this.options, this.verify);
  }

  verify: VerifyCallback = (payload, done) => {
    this.verifyHandle<TVerifyResultData>(
      async () => ({
        user: await this.userService.getUserById(payload.userId),
      }),
      done,
    );
  };
}
