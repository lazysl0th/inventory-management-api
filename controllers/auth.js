import { register, resetPassword, changePassword } from '../services/auth.js';
import { response, modelName } from '../constants.js';
import Conflict from '../errors/conflict.js';
import config from '../config.js';

const { CREATED, CONFLICT, RESET_PASSWORD, PASSWORD_CHANGE, OK} = response;
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
        if (req.headers['content-type']?.includes('application/json')) return res.status(200).json(req.user);
        return res.redirect(`${FRONTEND}/?token=${req.user.token}`);
    } catch (e) {
        console.log(e);
        return next(e);
    }
}

export const resetPasswordUser = async (req, res, next) => {
    try {
        const info = await resetPassword(req.body.email);
        return res.status(OK.statusCode).send({text: RESET_PASSWORD.text});
    } catch (e) {
        console.log(e);
        return next(e);
    }
}

export const changePasswordUser = async (req, res, next) => {
    try {
        await changePassword(req.body.token, req.body.password);
        return res.status(OK.statusCode).send({text: PASSWORD_CHANGE.text});
    } catch (e) {
        console.log(e);
        return next(e);
    }
}