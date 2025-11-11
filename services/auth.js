import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByParam, updateUserDataByCondition, updateUserPassword } from '../models/user.js';
import { sendMessage } from '../services/email/email.js';
import { urls } from '../services/email/config.js';
import BadRequest from '../errors/badRequest.js';
import { resetPasswordMsgTemplate } from '../services/email/templates.js'
import config from '../config.js';


const { SALT_ROUNDS, JWT_SECRET, BAD_REQUEST } = config;

export const register = async ({ name, email, password, provider, socialId }) => {
    const hash = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;
    return createUser({ name, email, hash, provider, socialId });
}

const createToken = (id, role, remember) => {
    const expiresIn = remember ? '7d' : '2h';
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn });
}

export const login = ({ email, password, remember, provider, socialId, name }) => {
    if (!provider) return loginByEmail(email, password, remember);
    return loginBySocial(provider, socialId, email, name);
}

const loginByEmail = async (email, userPassword, remember) => {
    const { password, ...user } = await findUserByParam('email', email);
    if (!user) return null;
    const matched = bcrypt.compare(userPassword, password);
    if (!matched) return null;
    const token = createToken(user.id, user.roles, remember);
    return { user, token };
}

const loginBySocial = async (provider, socialId, email, name) => {
    try {
        let user = await findUserByParam('email', email);
        if (!user || user[provider] != socialId) {
            if (user) updateUserDataByCondition('email', email, provider, socialId);
            else user = await register({ name, email, provider, socialId });
        }
        const token = createToken(user.id);
        return { user, token };
    } catch (e) {
        console.log(e)
    }
}

export const resetPassword = async (email) => {
    try{
        const user = await findUserByParam('email', email);
        const token = jwt.sign({ id: user.id, type: "reset" }, JWT_SECRET, { expiresIn: '15m' });
        await updateUserDataByCondition('email', email, 'reset_token', token);
        return await sendMessage(user, token, urls.resetPass, resetPasswordMsgTemplate);
    } catch (e) {
        console.log(e);
    }

}

export const changePassword = async (token, password) => {
    try {
        const tokenInfo = jwt.verify(token, JWT_SECRET);
        if (tokenInfo.type != 'reset' ) throw new BadRequest(BAD_REQUEST.text)
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return await updateUserPassword(token, hash);
    } catch (e) {
        console.log(e);
        return next(e);
    }
}