import type { Handler } from "express";
import type { TEmailAuthData } from "../services/Auth.js";
import type { TSafeUserWithRoles } from "../models/User.js";

export interface IChangePasswordData {
    token: string;
    password: string;
}

export interface ISafeUserWithToken {
    user: TSafeUserWithRoles;
    accessToken: string;
}

export interface IAuthController {
    registerUser: Handler;
    loginUserByEmail: Handler;
    loginUserBySocials: Handler;
    resetUserPassword: Handler;
    changeUserPassword: Handler;
    refreshAccessToken: Handler;
    logoutUser: Handler;
    /*exchangeDropBoxCodeOnToken: Handler;*/
}