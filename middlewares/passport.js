import passport from 'passport';
import Unauthorized from '../errors/unauthorized.js';
import Forbidden from '../errors/forbidden.js';
import NotFound from '../errors/notFound.js';
import { response } from '../constants.js';

const { UNAUTHORIZED, NO_AUTH_TOKEN, JWT_EXPIRED, FORBIDDEN, NOT_FOUND, INSUFFICIENT_PERMISSION} = response;

export const passportAuth = (strategy, requiredRoles) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (e, user, info) => {
        if (e) return next(e);
        if (!user) {
            if (info.message == UNAUTHORIZED.text) return next(new Unauthorized(UNAUTHORIZED.text));
            if ([NO_AUTH_TOKEN.text, JWT_EXPIRED.text].includes(info.message)) return next(new Forbidden(FORBIDDEN.text));
            if (info.message == NOT_FOUND.text) return next(new NotFound(NOT_FOUND.text));
        }
        req.user = user;
        if (requiredRoles?.length > 0) {
            const userRoles = user.roles.map(role => role.role.name);
            const hasRole = requiredRoles.some(role => userRoles.includes(role));
            if (!hasRole) {
                return next(new Forbidden(INSUFFICIENT_PERMISSION.text));
            }
        }
        next();
    })
    (req, res, next);
  };
};