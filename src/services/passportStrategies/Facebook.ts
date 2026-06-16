import {
  Strategy,
  type StrategyOptions,
  type VerifyFunction,
} from "passport-facebook";
import type { IStrategy } from "../../types/base/Passport.js";
import Passport from "../../base/Passport.js";
import type {
  IAuthResultData,
  IAuthService,
} from "../../types/services/Auth.js";
import { FACEBOOK } from "../../constants/integration.js";

export default class FacebookStrategy
  extends Passport
  implements IStrategy<Strategy>
{
  readonly strategy: Strategy;
  private readonly options: StrategyOptions;

  constructor(private readonly authService: IAuthService) {
    super();
    this.options = {
      clientID: FACEBOOK.CLIENT_ID,
      clientSecret: FACEBOOK.CLIENT_SECRET,
      callbackURL: FACEBOOK.CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    };
    this.strategy = new Strategy(this.options, this.verify);
  }

  verify: VerifyFunction = (accessToken, refreshToken, profile, done) => {
    this.verifyHandle<IAuthResultData>(
      async () =>
        await this.authService.loginUserBySocials({
          provider: "facebookId",
          socialId: profile.id,
          email: profile.emails?.[0]?.value ?? "",
          name: profile.displayName,
        }),
      done,
    );
  };
}
