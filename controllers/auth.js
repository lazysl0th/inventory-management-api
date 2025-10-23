import { register } from '../services/auth.js';
import { response, modelName } from '../constants.js';
import Conflict from '../errors/conflict.js';
import config from '../config.js';

const { CREATED, CONFLICT, OK } = response;
const { FRONTEND } = config;

export const registerUser = async (req, res, next) => {
    try{
        const user = await register(req.body);
        return res.status(CREATED.statusCode).send({ user });
    } catch (e) {
        console.log(e)
        if (e.code == 'P2002') return next(new Conflict(CONFLICT.text(modelName.USER)));
        return next(e);
    }
}

export const loginUser = (req, res, next) => {
    try {
        return res.redirect(`${FRONTEND}/?token=${req.user.token}`);
    } catch (e) {
        console.log(e);
        return next(e);
    }
}