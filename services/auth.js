import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByParam, updateUserData } from '../models/user.js';
import config from '../config.js';

const { SALT_ROUNDS, JWT_SECRET } = config;

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
            if (user) updateUserData('email', email, provider, socialId);
            else user = await register({ name, email, provider, socialId });
        }
        const token = createToken(user.id);
        return { user, token };
    } catch (e) {
        console.log(e)
    }
}