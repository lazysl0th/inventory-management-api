//import { createUser, findUserByCredentials  } from '../models/user.js';
//import Conflict from '../errors/conflict.js';
//import Unauthorized from '../errors/unauthorized.js';
//import { response } from '../constants.js'
//import config from '../config.js';
//import jwt from 'jsonwebtoken';


//const { CREATED, CONFLICT, OK, UNAUTHORIZED } = response;
//const { JWT_SECRET } = config;

export const getUser = async (req, res, next) => {
    console.log('User');
}

/*
export const register = async (req, res, next) => {
    try{
        const user = await createUser(req.body.name, req.body.email, req.body.password);
        return res.status(CREATED.statusCode).send({ user });
    } catch (e) {
        console.log(e)
        if (e.code == 'P2002') return next(new Conflict(CONFLICT.text));
        return next(e);
    }
}*/

/*
const createToken = (remember, id) => {
    if (remember) return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: '7d' });
    return jwt.sign({ id: id }, JWT_SECRET, { expiresIn: '2h' });
}*/