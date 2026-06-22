import { inject, injectable } from "tsyringe";
import {
  Strategy,
  ExtractJwt,
  type VerifyCallback,
  type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import {
  CONFIG_TOKEN,
  type TJwtServiceConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import PassportService from "../PassportService.js";
import type { IAuthStrategy } from "#/application/auth/interfaces/IAuthStrategy.js";
import type { IAuthRepository } from "#/application/auth/interfaces/IAuthRepository.js";

@injectable()
export default class PassportJwtStrategy implements IAuthStrategy {
  options: StrategyOptionsWithoutRequest;

  constructor(
    @inject("AuthRepository")
    private readonly authRepository: IAuthRepository,
    @inject(PassportService) private readonly authService: PassportService,
    @inject(CONFIG_TOKEN) private readonly config: TJwtServiceConfig,
  ) {
    this.options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.config.JWT_SECRET,
    };
  }

  private verify: VerifyCallback = async (payload, done): Promise<void> => {
    const user = await this.authRepository.getUserById(payload.userId);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  };

  register(): void {
    this.authService.passport.use(new Strategy(this.options, this.verify));
  }
}
