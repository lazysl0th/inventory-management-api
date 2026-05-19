import { Controller } from "../base/Controller.js";
import type { IAuthController, IChangePasswordData, ISafeUserWithToken } from "../types/controllers/Auth.js";
import type { IAuthService, IRegData, ISocialAuthData, TResetUserPasswordData } from "../types/services/Auth.js";
import type { Handler } from "express";
import Forbidden from "../errors/Forbidden.js";
import { FRONTEND_URL } from "../constants/base.js";
import { AUTH_SUCCESS } from "../constants/uri.js";
import { CHANGE_PASSWORD, FORBIDDEN, LOGOUT, RESET_PASSWORD } from "../constants/response.js";

export default class AuthController extends Controller implements IAuthController {
    
    constructor(private readonly AuthService: IAuthService) {
        super();
    }

    registerUser: Handler = this.handle<{}, IRegData | ISocialAuthData>(async (req, res) => {
        const regData = req.body;
        const authData = await this.AuthService.registerUser(regData);
        this.setCookie(res, 'refreshToken', authData.authTokens.refreshToken);
        this.created<{ accessToken: string }>(res, { accessToken: authData.authTokens.accessToken });
    })
    
    loginUserByEmail: Handler = this.handle(async(req, res) => {
        const authTokens = req.authInfo;
        const user = req.user;
        this.setCookie(res, 'refreshToken', authTokens.refreshToken);
        this.ok<ISafeUserWithToken>(res, { user, accessToken: authTokens.accessToken });
    })

    loginUserBySocials: Handler = this.handle(async(req, res) => {
        const redirectUrl = FRONTEND_URL + AUTH_SUCCESS
        const authTokens = req.authInfo;
        console.log(req.authInfo)
        this.setCookie(res, 'refreshToken', authTokens.refreshToken);
        this.redirect(res, redirectUrl, authTokens.accessToken);
    })
    
    resetUserPassword: Handler = this.handle<{}, TResetUserPasswordData>(async (req, res) => {
        const email = req.body.email;
        const info = await this.AuthService.resetUserPassword(email);
        this.ok<{ message: string }>(res, { message: RESET_PASSWORD.TEXT })
    })
    
    changeUserPassword: Handler = this.handle<{}, IChangePasswordData>(async (req, res) => {
        const changePasswordData = req.body
        await this.AuthService.changeUserPassword(changePasswordData.token, changePasswordData.password);
        this.ok<{ message: string }>(res, { message: CHANGE_PASSWORD.TEXT })
    })

    logoutUser: Handler = this.handle(async(req, res) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw new Forbidden( FORBIDDEN.TEXT);
        await this.AuthService.logoutUser(refreshToken);
        this.deleteCookie(res, 'refreshToken');
        this.ok<{ message: string }>(res, { message: LOGOUT.TEXT });
    })

    refreshAccessToken: Handler = this.handle(async(req, res) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw new Forbidden(FORBIDDEN.TEXT);
        const accessToken = await this.AuthService.refreshAccessToken(refreshToken);
        this.ok<{ accessToken: string }>(res, { accessToken: accessToken });
    })
}