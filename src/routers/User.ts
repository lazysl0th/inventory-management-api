import Passport from "../base/Passport.js";
import Router from "../base/Router.js";
import type { IBaseRouter } from "../types/base/Router.js";
import type { IUserController } from "../types/controllers/User.js";
import type { IUserValidator } from "../types/validators/User.js";

export default class UserRouter extends Router implements IBaseRouter {
  constructor(
    private readonly UserController: IUserController,
    private readonly UserValidator: IUserValidator,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(
      "/me",
      Passport.authorize("jwt"),
      this.UserController.getUserProfile,
    );
    this.router.get(
      "/:userId",
      this.UserValidator.getUser(),
      this.UserController.getUser,
    );
    this.router.patch(
      "/:userId",
      this.UserValidator.updateUser(),
      Passport.authorize("jwt"),
      this.UserController.updateUser,
    );
    this.router.use(Passport.authorize("jwt", ["Admin"]));
    this.router.get("/", this.UserController.getUsers);
    this.router.patch("/status", this.UserController.updateUsersStatus);
    this.router.patch(
      "/",
      this.UserValidator.updateUsers(),
      this.UserController.updateUsers,
    );
    this.router.delete(
      "/",
      this.UserValidator.deleteUsers(),
      this.UserController.deleteUsers,
    );
  }
}
