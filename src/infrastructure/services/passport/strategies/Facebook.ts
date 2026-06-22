import {
  Strategy,
  type StrategyOptions,
  type VerifyFunction,
} from "passport-facebook";
import {
  CONFIG_TOKEN,
  type TFacebookConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import { inject, injectable } from "tsyringe";
import LoginWithOAuth from "#/application/auth/use-cases/LoginWithOAuth.js";
import PassportService from "../PassportService.js";
import type { IAuthStrategy } from "#/application/auth/interfaces/IAuthStrategy.js";

@injectable()
export default class PassportFacebookStrategy implements IAuthStrategy {
  options: StrategyOptions;

  constructor(
    @inject(LoginWithOAuth) private readonly loginWithOAuth: LoginWithOAuth,
    @inject(PassportService) private readonly authService: PassportService,
    @inject(CONFIG_TOKEN) private readonly config: TFacebookConfig,
  ) {
    this.options = {
      clientID: this.config.FACEBOOK_CLIENT_ID,
      clientSecret: this.config.FACEBOOK_CLIENT_SECRET,
      callbackURL: this.config.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    };
  }

  private verify: VerifyFunction = async (_, __, profile, done) => {
    const { user, authTokens } = await this.loginWithOAuth.execute({
      provider: "facebook",
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? "",
      name: profile.displayName,
    });
    return done(null, user, { authTokens });
  };

  register(): void {
    this.authService.passport.use(new Strategy(this.options, this.verify));
  }
}
