import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { findUserByParam } from '../../../models/user.js';
import config from '../../../config.js';
import { response } from '../../../constants.js';

const { JWT_SECRET } = config;
const { NOT_FOUND } = response;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

const verifyToken = async (payload, done) => {
    try {
        const user = await findUserByParam('id', payload.id);
        if (!user) return done(null, false, { message: NOT_FOUND.text });
        return done(null, user);
    } catch (e) {
        console.log(e);
        return done(e, false);
    }
}

const jwtStrategy = new JwtStrategy(options, verifyToken);

export default jwtStrategy;