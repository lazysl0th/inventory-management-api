import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { findUserByParam } from '../../../models/user.js';
import config from '../../../config.js';
import { response, userStatus } from '../../../constants.js';

const { JWT_SECRET } = config;
const { FORBIDDEN, BLOCKED } = response;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

const verifyToken = async (payload, done) => {
    try {
        const foundUser = await findUserByParam('id', payload.id);
        if (!foundUser) return done(null, false, { message: FORBIDDEN.text });
        if (foundUser.status == userStatus.BLOCKED) return done(null, false, { message: BLOCKED.text })
        const { password, ...user } = foundUser;
        return done(null, user);
    } catch (e) {
        console.log(e);
        return done(e, false);
    }
}

const jwtStrategy = new JwtStrategy(options, verifyToken);

export default jwtStrategy;