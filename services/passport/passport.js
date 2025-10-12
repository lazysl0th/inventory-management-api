import passport from 'passport';
import localStrategy from './strategies/local.js';
import jwtStrategy from './strategies/jwt.js';
import googleStrategy from './strategies/google.js';
import facebookStrategy from './strategies/facebook.js';

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);
passport.use(facebookStrategy);

export default passport;