import type { RequestHandler } from "express";
import { inject, injectable } from "tsyringe";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import type User from "#/domain/entities/User.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import type {
  TDeleteUsersBodyDto,
  TGetUserParamsDto,
  TGetUsersQueryDto,
  TUpdateUserBodyDto,
  TUpdateUserParamsDto,
  TUpdateUsersBodyDto,
} from "#/application/user/dtos/UserDto.js";
import ForbiddenError from "#/domain/errors/ForbiddenError.js";
import GetUser from "#/application/user/use-cases/GetUser.js";
import GetUsers from "#/application/user/use-cases/GetUsers.js";
import UpdateUser from "#/application/user/use-cases/UpdateUser.js";
import UpdateUsers from "#/application/user/use-cases/UpdateUsers.js";
import DeleteUsers from "#/application/user/use-cases/DeleteUsers.js";

@injectable()
export default class UserController {
  constructor(
    @inject(GetUser) private readonly getUserById: GetUser,
    @inject(GetUsers) private readonly getUsersByCondition: GetUsers,
    @inject(UpdateUser) private readonly updateUserById: UpdateUser,
    @inject(UpdateUsers) private readonly updateUsersById: UpdateUsers,
    @inject(DeleteUsers) private readonly deleteUsersById: DeleteUsers,
  ) {}

  getUserProfile: RequestHandler<never, User> = async (req, res) => {
    if (req.isAuthenticated()) {
      throw new UnauthorizedError();
    }
    const user = req.user;
    res.status(HttpStatusCode.Ok).json(user);
  };

  getUser: RequestHandler<TGetUserParamsDto, User> = async (req, res) => {
    const { userId } = req.params;
    const user = await this.getUserById.execute({ userId });
    res.status(HttpStatusCode.Ok).json(user);
  };

  getUsers: RequestHandler<never, User[], never, TGetUsersQueryDto> = async (
    req,
    res,
  ) => {
    const { searchQuery } = req.query;
    const users = await this.getUsersByCondition.execute({ searchQuery });
    res.status(HttpStatusCode.Ok).json(users);
  };

  /*getUsersList: RequestHandler<never, User[]> = async (req, res) => {
    const users = await this.getUsersByCondition.execute({ query: "" });
    res.status(HttpStatusCode.Ok).json(users);
  }*/

  updateUser: RequestHandler<TUpdateUserParamsDto, User, TUpdateUserBodyDto> =
    async (req, res) => {
      if (req.isAuthenticated() && req.user.id === req.params.userId) {
        // || Passport.checkUserRoles(currentUser, ["Admin"])

        const userId = req.params.userId;
        const userData = req.body;
        const user = await this.updateUserById.execute({
          userId,
          ...userData,
        });
        res.status(HttpStatusCode.Ok).json(user);
      } else {
        throw new ForbiddenError("Insufficient permission");
      }
    };

  updateUsers: RequestHandler<never, { count: number }, TUpdateUsersBodyDto> =
    async (req, res) => {
      const userIds = req.body.ids;
      const usedData = req.body.data;
      const result = await this.updateUsersById.execute({
        ids: userIds,
        data: usedData,
      });
      res.status(HttpStatusCode.Ok).json(result);
    };

  deleteUsers: RequestHandler<never, { count: number }, TDeleteUsersBodyDto> =
    async (req, res) => {
      const userIds = req.body.userIds;
      const result = await this.deleteUsersById.execute({ userIds });
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
