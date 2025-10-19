import passport from 'passport';

export default ({ req }) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, (e, user) => {
            if (e) return reject(e);
            resolve({ user });
        }) (req);
    });
}