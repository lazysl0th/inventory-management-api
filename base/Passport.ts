import passport, { type AuthenticateCallback, type Strategy } from "passport";
import type { Handler, Request, Response } from "express";
import type { DoneCallbackWithOptions, IVerifyOptionsExtends, TAuthResult, VerifyUserHandler } from "../types/base/Passport.js";
import type { IError } from "../types/base/Error.js";
import Unauthorized from "../errors/Unauthorized.js";
import Forbidden from "../errors/Forbidden.js";
import NotFound from "../errors/NotFound.js";
import type { TSafeUserWithRoles } from "../types/models/User.js";
import { Status, type Role } from "@prisma/client";
import type { IAuthResultData, TVerifyResultData } from "../types/services/Auth.js";
import jwt from 'jsonwebtoken';
import { BLOCKED, INSUFFICIENT_PERMISSION, NOT_FOUND, UNAUTHORIZED } from "../constants/response.js";
import { NO_TOKEN } from "../constants/errorText.js";

export default abstract class Passport{
    protected async verifyHandle<TUser>(handler: VerifyUserHandler<TUser>, done: DoneCallbackWithOptions): Promise<void> {
        try {
            const authResult = await handler() as IAuthResultData | TVerifyResultData | null;
            if (!authResult) return done(null, false, { message: UNAUTHORIZED.TEXT });
            if (authResult.user.status === Status.Blocked) return done(null, false, { message: BLOCKED.TEXT });
            return done(null, authResult.user, { message: '', authTokens: 'authTokens' in authResult ? authResult.authTokens : undefined });
        } catch(e) {
            return done(e);
        }
    }

    private static _connectStrategies(strategies: Strategy[]): void {
        strategies.forEach(strategy => passport.use(strategy))
    }

    static initialize(strategies: Strategy[]): Handler {
        this._connectStrategies(strategies);
        return passport.initialize();
    }

    static checkUserRoles(user: TSafeUserWithRoles, requireRoles: Role['name'][]): IError | void {
        const userRoles = user.roles.map(role => role.role.name);
        const hasRole = requireRoles.some(role => userRoles.includes(role));
        if (!hasRole) return new Forbidden(INSUFFICIENT_PERMISSION.TEXT);
    }

    private static _createAuthError(info: IVerifyOptionsExtends): IError | void {
        switch(info.message) {
            case UNAUTHORIZED.TEXT || NO_TOKEN || info instanceof jwt.JsonWebTokenError: return new Unauthorized(UNAUTHORIZED.TEXT);
            case BLOCKED.TEXT: return new Forbidden(BLOCKED.TEXT);
            case NOT_FOUND.TEXT: return new NotFound(NOT_FOUND.TEXT);
            default: return new Unauthorized(info.message || UNAUTHORIZED.TEXT);
        }
    }

    private static _handleAuthenticate(resolve: (authResult: TAuthResult) => void, reject: (e: any) => void): AuthenticateCallback {
        return (e, user, info) => {
            if (e) return reject(e);
            //console.log(user)
            //console.log(info)
            if (!user) return reject(this._createAuthError(info as IVerifyOptionsExtends));
            resolve({ user: user as TSafeUserWithRoles, info: info as IVerifyOptionsExtends });
        }
    }

    private static _authenticate(strategy: string, req: Request, res: Response, strategyParams: object = {},): Promise<TAuthResult> {
        return new Promise<TAuthResult>((resolve, reject) => {
            passport.authenticate(
                strategy,
                { session: false, authInfo: true, ...strategyParams },
                this._handleAuthenticate(resolve, reject)
            )(req, res, undefined)
        })
    }

    static authorize (strategy: string, strategyParams?: object, requireRole?: Role['name'][]): Handler {
        return async (req, res, next) => {
            const authResult = await this._authenticate(strategy, req, res, strategyParams);
            if (authResult.user && requireRole) this.checkUserRoles(authResult.user, requireRole);
            req.user = authResult.user;
            req.authInfo = authResult.info.authTokens
            next();
        }
    }
}