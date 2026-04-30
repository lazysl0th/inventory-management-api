import { Controller } from "../base/Controller.js";
import type { TSafeUserWithRoles, TUserUpdateData } from "../types/models/User.js";
import type { IUserController, IParamUserId, IParamUserIds, IBodyUpdateUserStatus, IQueryUserFilter, IBodyUpdateUsers } from "../types/controllers/User.js";
import BadRequest from "../errors/BadRequest.js";
import type { Handler } from "express";
import type { IUserService } from "../types/services/User.js";
import Passport from "../base/Passport.js";
import Forbidden from "../errors/Forbidden.js";
import { BAD_REQUEST, INSUFFICIENT_PERMISSION } from "../constants/response.js";

export default class UserController extends Controller implements IUserController {
    
    constructor(private readonly UserService: IUserService) {
        super();
    }

    getUserProfile: Handler = this.handle(async (req, res) => {
        const user = req.user;
        this.ok<TSafeUserWithRoles>(res, user);
    })

    getUser: Handler = this.handle<IParamUserId>(async (req, res) => {
        const userId = req.params.userId;
        const user = await this.UserService.getUserById(userId);
        this.ok<TSafeUserWithRoles>(res, user);
    });

    getUsers: Handler = this.handle<{}, {}, IQueryUserFilter>(async (req, res) => {
        const query = req.query.query;
        const users = await this.UserService.getUsers(query);
        this.ok<TSafeUserWithRoles[]>(res, users)
    });

    updateUser: Handler = this.handle<IParamUserId, TUserUpdateData>(async (req, res) => {
        const userId = req.params.userId;
        const userData = req.body;
        const currentUser = req.user;
        if (currentUser.id !== userId && !Passport.checkUserRoles(currentUser, ['Admin'])) throw new Forbidden(INSUFFICIENT_PERMISSION.TEXT);
        const updatedUser = await this.UserService.updateUser(userId, userData);
        this.ok<TSafeUserWithRoles>(res, updatedUser)
    });

    updateUsersStatus: Handler = this.handle<{}, IBodyUpdateUserStatus>(async (req, res) => {
        const userIds = req.body.userIds;
        const status = req.body.status;
        if (!Array.isArray(userIds) || !status) throw new BadRequest(BAD_REQUEST.TEXT);
        const result = await this.UserService.updateUserStatus(userIds, status);
        this.ok<{ count: number }>(res, result);
    })

    updateUsers: Handler = this.handle<{}, IBodyUpdateUsers>(async (req, res) => {
        const userIds = req.body.ids;
        const usedData = req.body.data;
        const result = await this.UserService.updateUsers(userIds, usedData);
        this.ok<{ count: number }>(res, result);
    })

    deleteUsers: Handler = this.handle<{}, IParamUserIds>(async (req, res) => {
        const userIds = req.body.userIds;
        const result = await this.UserService.deleteUsers(userIds);
        this.ok<{ count: number }>(res, result)
    })
}