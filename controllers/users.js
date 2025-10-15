import { findUserByParam, selectAllUsers, updateStatusByIds, deleteUsersByIds } from '../models/user.js';
import { updateUsersRolesById } from '../models/userRole.js';
import NotFound from '../errors/notFound.js';
import BadRequest from '../errors/badRequest.js'
import { response } from '../constants.js'

const { NOT_FOUND, OK, BAD_REQUEST } = response;

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await findUserByParam('id', req.user.id);
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

export const deleteUsers = async (req, res, next) => {
  try {
    return res.status(OK.statusCode).send(await deleteUsersByIds(req.body.usersId));
  } catch (e) {
    console.log(e)
    if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
    return next(e)
  }
}

export const updateUsersStatus = async (req, res, next) => {
  try {
    return res.status(OK.statusCode).send(await updateStatusByIds(req.body.ids, req.body.status));
  } catch (e) {
    console.log(e)
    if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
    return next(e)
  }
}

export const updateUsersRoles = async (req, res, next) => {
  try {
    return res.status(OK.statusCode).send(await updateUsersRolesById(req.body.usersId, req.body.rolesId));
  } catch (e) {
    console.log(e);
    if (e.code === 'P2023' || e.code === 'P2000' || e.code === 'P2003' || e.code === 'P2011') return next(new BadRequest(BAD_REQUEST.text));
    return next(e)
  }
}