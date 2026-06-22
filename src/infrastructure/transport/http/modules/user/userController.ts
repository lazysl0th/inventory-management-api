import type { RequestHandler } from "express";
import { injectable } from "tsyringe";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import type User from "#/domain/entities/User.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import type { IUserService } from "../../../../../types/services/User.js";
import type {
  TDeleteUsersBodyDto,
  TGetUserParamsDto,
  TGetUsersQueryDto,
  TUpdateUserBodyDto,
  TUpdateUserParamsDto,
  TUpdateUsersBodyDto,
} from "#/application/user/dtos/UserDto.js";
import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";
import ForbiddenError from "#/domain/errors/ForbiddenError.js";

@injectable()
export default class UserController {
  constructor(private readonly userService: IUserService) {}

  getUserProfile: RequestHandler<never, User> = async (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      res.status(HttpStatusCode.Ok).json(user);
    } else {
      throw new UnauthorizedError();
    }
  };

  getUser: RequestHandler<TGetUserParamsDto, TSafeUserWithRoles> = async (
    req,
    res,
  ) => {
    const { userId } = req.params;
    const user = await this.userService.getUserById(userId);
    res.status(HttpStatusCode.Ok).json(user);
  };

  getUsers: RequestHandler<
    never,
    TSafeUserWithRoles[],
    never,
    TGetUsersQueryDto
  > = async (req, res) => {
    const { query } = req.query;
    const users = await this.userService.getUsers(query);
    res.status(HttpStatusCode.Ok).json(users);
  };

  updateUser: RequestHandler<
    TUpdateUserParamsDto,
    TSafeUserWithRoles,
    TUpdateUserBodyDto
  > = async (req, res) => {
    if (req.isAuthenticated() && req.user.id === req.params.userId) {
      // || Passport.checkUserRoles(currentUser, ["Admin"])

      const userId = req.params.userId;
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(userId, userData);
      res.status(HttpStatusCode.Ok).json(updatedUser);
    } else {
      throw new ForbiddenError("Insufficient permission");
    }
  };

  updateUsers: RequestHandler<never, { count: number }, TUpdateUsersBodyDto> =
    async (req, res) => {
      const userIds = req.body.ids;
      const usedData = req.body.data;
      const result = await this.userService.updateUsers(userIds, usedData);
      res.status(HttpStatusCode.Ok).json(result);
    };

  deleteUsers: RequestHandler<never, { count: number }, TDeleteUsersBodyDto> =
    async (req, res) => {
      const userIds = req.body.userIds;
      const result = await this.userService.deleteUsers(userIds);
      res.status(HttpStatusCode.Ok).json(result);
    };
  /*
                  updateUsersStatus: Handler = this.handle<object, IBodyUpdateUserStatus>(
                    async (req, res) => {
                      const userIds = req.body.userIds;
                      const status = req.body.status;
                      if (!Array.isArray(userIds) || !status)
                        throw new BadRequest(BAD_REQUEST.TEXT);
                      const result = await this.UserService.updateUserStatus(userIds, status);
                      this.ok<{ count: number }>(res, result);
                    },
                  );*/
}
