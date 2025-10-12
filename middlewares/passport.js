import passport from 'passport';
import Unauthorized from '../errors/unauthorized.js';
import Forbidden from '../errors/forbidden.js';
import NotFound from '../errors/notFound.js';
import { response } from '../constants.js';

const { UNAUTHORIZED, NO_AUTH_TOKEN, FORBIDDEN, NOT_FOUND} = response;

export const passportAuth = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (e, user, info) => {
        if (e) return next(e);
        if (!user) {
            if (info.message == UNAUTHORIZED.text) return next(new Unauthorized(UNAUTHORIZED.text));
            if (info.message == NO_AUTH_TOKEN.text) return next(new Forbidden(FORBIDDEN.text));
            if (info.message == NOT_FOUND.text) return next(new NotFound(NOT_FOUND.text));
        }
        req.user = user;
        next();
    })
    (req, res, next);
  };
};