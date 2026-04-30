import { Strategy, type StrategyOptions } from 'passport-google-oauth20';
import type { IStrategy, VerifyFunction } from '../../types/base/Passport.js';
import Passport from '../../base/Passport.js';
import type { IAuthResultData, IAuthService } from '../../types/services/Auth.js';
import { GOOGLE } from '../../constants/integration.js';

export default class GoogleStrategy extends Passport implements IStrategy<Strategy> {
    readonly strategy: Strategy;
    private readonly options: StrategyOptions;

    constructor (private readonly authService: IAuthService) {
        super();
        this.options = {
            clientID: GOOGLE.CLIENT_ID,
            clientSecret: GOOGLE.CLIENT_SECRET,
            callbackURL: GOOGLE.CALLBACK_URL,
        };
        this.strategy = new Strategy(this.options, this.verify);
    }

    verify: VerifyFunction = (accessToken, refreshToken, profile, done) => {
        this.verifyHandle<IAuthResultData>(
            async () => await this.authService.loginUserBySocials({provider: 'googleId', socialId: profile.id, email: profile.emails?.[0]?.value ?? '', name: profile.displayName}),
            done
        );
    };
}