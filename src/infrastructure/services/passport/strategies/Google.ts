import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { inject, injectable } from "tsyringe";
import LoginWithOAuth from "#/application/auth/use-cases/LoginWithOAuth.js";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import {
  CONFIG_TOKEN,
  type TGoogleConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import PassportService from "../PassportService.js";
import type { IAuthStrategy } from "#/application/auth/interfaces/IAuthStrategy.js";

@injectable()
export default class PassportGoogleStrategy implements IAuthStrategy {
  options: StrategyOptions;

  constructor(
    @inject(LoginWithOAuth) private readonly loginWithOAuth: LoginWithOAuth,
    @inject(PassportService) private readonly authService: PassportService,
    @inject(CONFIG_TOKEN) private readonly config: TGoogleConfig,
  ) {
    this.options = {
      clientID: this.config.GOOGLE_CLIENT_ID,
      clientSecret: this.config.GOOGLE_CLIENT_SECRET,
      callbackURL: this.config.GOOGLE_CALLBACK_URL,
    };
  }

  private verify = async (
    _: string,
    __: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> => {
    const { user, authTokens } = await this.loginWithOAuth.execute({
      provider: "google",
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
