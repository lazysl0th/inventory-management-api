import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { login } from '../../auth.js';
import config from '../../../config.js';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = config;

const verifyGoogleUser = async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await login({
            provider: 'googleId',
            socialId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
        });
        return done(null, user);
    } catch (e) {
        return done(e);
    }
}

const googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
}, verifyGoogleUser);

export default googleStrategy;