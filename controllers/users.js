import { findUserByParam, selectAllUsers, selectUserById, updateStatusByIds, deleteUsersByIds, updateUserProfile } from '../models/user.js';
import { updateUsersRolesById } from '../models/userRole.js';
import NotFound from '../errors/notFound.js';
import BadRequest from '../errors/badRequest.js';
import Conflict from '../errors/conflict.js';
import { response } from '../constants.js'

const { NOT_FOUND, OK, BAD_REQUEST, CONFLICT } = response;

export const getUserProfile = async (req, res, next) => {
    try {
        const {password, ...user} = await findUserByParam('id', req.user.id);
        if (!user) throw new NotFound(NOT_FOUND.text);
        return res.status(OK.statusCode).send(user);
    } catch (e) {
        if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
        return next(e);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await selectAllUsers();
        res.status(OK.statusCode).send(users)
    } catch (e) {
        console.log(e);
        next(e);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const users = await selectUserById(Number(req.params.userId));
        res.status(OK.statusCode).send(users)
    } catch (e) {
        console.log(e);
        next(e);
    }
};

export const deleteUsers = async (req, res, next) => {
    try {
        return res.status(OK.statusCode).send(await deleteUsersByIds(req.body.usersIds));
    } catch (e) {
        console.log(e)
        if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
        return next(e)
    }
}

export const updateUsersStatus = async (req, res, next) => {
    try {
        return res.status(OK.statusCode).send(await updateStatusByIds(req.body.usersIds, req.body.status));
    } catch (e) {
        console.log(e)
        if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
        return next(e)
    }
}

export const updateUsersRoles = async (req, res, next) => {
    try {
        const newUsersRoles = req.body.usersIds.flatMap((userId) => req.body.rolesIds.map((roleId) => ({ userId, roleId })));
        return res.status(OK.statusCode).send(await updateUsersRolesById(req.body.usersIds, req.body.rolesIds, newUsersRoles));
    } catch (e) {
        console.log(e);
        if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
        return next(e);
    }
}

export const updateUser = async(req, res, next) => {
    try {
        const {password, ...userData} = await updateUserProfile(req.body.userId ? req.body.userId : req.user.id, { name: req.body.name, email: req.body.email });
        return res.status(OK.statusCode).send(userData)
    } catch (e) { 
        console.log(e);
        if (e.code == 'P2002') return next(new Conflict(CONFLICT.text(modelName.USER)));
        if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
        return next(e);
    }
}