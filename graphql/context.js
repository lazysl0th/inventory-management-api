import prisma from '../infrastructure/prisma.js'
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export default async function createContext({ req, connectionParams }) {
    return new Promise((resolve, reject) => {
        if (!req && connectionParams) {
            try {
                const authHeader = connectionParams.authorization || connectionParams.Authorization;
                if (authHeader) {
                    const token = authHeader.replace('Bearer ', '');
                    const user = jwt.verify(token, config.JWT_SECRET);
                    return resolve({ user, prisma });
                }
                    return resolve({ user: null, prisma });
            } catch (e) {
                console.error(e.message);
                return resolve({ user: null, prisma });
            }
        }
        if (req) {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) return reject(err);
            return resolve({ user, prisma });
        })(req);
        }
    });
}
