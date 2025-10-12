import LocalStrategy from 'passport-local';
import { login } from '../../auth.js';
import { response } from '../../../constants.js'

const { UNAUTHORIZED } = response;

const verifyUser = async (req, email, password, done) => {
    try {
        const { remember } = req.body;
        const user = await login({ email, password, remember });
        if (!user) return done(null, false, { message: UNAUTHORIZED.text });
        return done(null, user);
    } catch (e) {
        console.log(e);
        return done(e);
    }
  }

const localStrategy = new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    verifyUser
);

export default localStrategy;