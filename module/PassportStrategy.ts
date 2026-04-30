import FacebookStrategy from "../services/passportStrategies/Facebook.js";
import GoogleStrategy from "../services/passportStrategies/Google.js";
import JwtStrategy from "../services/passportStrategies/Jwt.js";
import LocalStrategy from "../services/passportStrategies/Local.js";
import type { IAuthService } from "../types/services/Auth.js";
import type { IUserService } from "../types/services/User.js";

export default class PassportStrategyModule {
    public readonly local: LocalStrategy;
    public readonly jwt: JwtStrategy;
    public readonly google: GoogleStrategy;
    public readonly facebook: FacebookStrategy;

    constructor(authService: IAuthService, userService: IUserService) {
        const { local, jwt, google, facebook } = this.init(authService, userService)
        this.local = local;
        this.jwt = jwt;
        this.google = google;
        this.facebook = facebook;
    }

    private init(authService: IAuthService, userService: IUserService) {
        const local = new LocalStrategy(authService);
        const jwt = new JwtStrategy(userService);
        const google = new GoogleStrategy(authService);
        const facebook = new FacebookStrategy(authService);
        return { local, jwt, google, facebook }
    }
}