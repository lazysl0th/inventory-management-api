import { register } from '../services/auth.js';
import { response } from '../constants.js';
import Conflict from '../errors/conflict.js';

const { CREATED, CONFLICT, OK } = response;

export const registerUser = async (req, res, next) => {
    try{
        const user = await register(req.body.name, req.body.email, req.body.password);
        return res.status(CREATED.statusCode).send({ user });
    } catch (e) {
        console.log(e)
        if (e.code == 'P2002') return next(new Conflict(CONFLICT.text));
        return next(e);
    }
}

export const loginUser = (req, res, next) => {
    try {
        const { user, token } = req.user;
        return res.status(OK.statusCode).send({ user, token });
    } catch (err) {
        console.log(e);
        return next(e);
    }
}