import { Strategy as FacebookStrategy } from 'passport-facebook';
import { login } from '../../auth.js';
import config from '../../../config.js';

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_CALLBACK_URL } = config;
console.log(FACEBOOK_APP_ID);

const verifyFacebookUser = async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await login({
            provider: 'facebookId',
            socialId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
        });
        return done(null, user);
    } catch (e) {
        return done(e);
    }
}

const facebookStrategy = new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails'],
}, verifyFacebookUser);

export default facebookStrategy;
