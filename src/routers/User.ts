import userValidations from "#/infrastructure/transport/http/modules/user/userValidations.js";
import Router from "../base/Router.js";
import type { IBaseRouter } from "../types/base/Router.js";
import type { IUserController } from "../types/controllers/User.js";

export default class UserRouter extends Router implements IBaseRouter {
  constructor(
    private readonly UserController: IUserController,
    //private readonly UserValidator: IUserValidator,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get(
      "/me",
      //Passport.authorize("jwt"),
      this.UserController.getUserProfile,
    );
    this.router.get(
      "/:userId",
      userValidations.getUser,
      this.UserController.getUser,
    );
    this.router.patch(
      "/:userId",
      userValidations.updateUser,
      //Passport.authorize("jwt"),
      this.UserController.updateUser,
    );
    //this.router.use(Passport.authorize("jwt", ["Admin"]));
    this.router.get("/", this.UserController.getUsers);
    this.router.patch("/status", this.UserController.updateUsersStatus);
    this.router.patch(
      "/",
      userValidations.updateUsers,
      this.UserController.updateUsers,
    );
    this.router.delete(
      "/",
      userValidations.deleteUsers,
      this.UserController.deleteUsers,
    );
  }
}
