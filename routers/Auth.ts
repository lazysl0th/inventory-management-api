import Passport from "../base/Passport.js";
import Router from "../base/Router.js";
import type { IAuthController } from "../types/controllers/Auth.js";
import type { IAuthRouter } from "../types/routers/Auth.js";
import type { IAuthValidator } from "../types/validators/Auth.js";

export default class AuthRouter extends Router implements IAuthRouter {
    constructor(
        private readonly AuthController: IAuthController,
        private readonly AuthValidator: IAuthValidator,
    ) {
        super();
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        this.router.post('/signup', this.AuthValidator.registerUser(), this.AuthController.registerUser);
        this.router.post('/signin', this.AuthValidator.loginUserByEmail(), Passport.authorize('local'), this.AuthController.loginUserByEmail);
        this.router.get('/refreshAccessToken', this.AuthController.refreshAccessToken);
        this.router.get('/signout', this.AuthController.logoutUser);
        this.router.get('/signin/google', Passport.authorize('google', { scope: ['email', 'profile'] }));
        this.router.get('/signin/google/callback', Passport.authorize('google', { failureRedirect: '/signin?error=google' }), this.AuthController.loginUserBySocials);
        this.router.get('/signin/facebook', Passport.authorize('facebook', { scope: ['email'] }));
        this.router.get('/signin/facebook/callback', Passport.authorize('facebook', { failureRedirect: '/signin?error=facebook' }), this.AuthController.loginUserBySocials);
        this.router.post('/resetPassword', this.AuthValidator.resetUserPassword(), this.AuthController.resetUserPassword);
        this.router.post('/changePassword', this.AuthController.changeUserPassword);
        
    }
}