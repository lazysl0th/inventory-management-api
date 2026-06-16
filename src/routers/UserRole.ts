import Router from "../base/Router.js";
import type { IBaseRouter } from "../types/base/Router.js";
import type { IUserRoleController } from "../types/controllers/UserRole.js";
import type { IUserRoleValidator } from "../types/validators/UserRole.js";

export default class UserRoleRouter extends Router implements IBaseRouter {
  constructor(
    private readonly UserRoleController: IUserRoleController,
    private readonly UserRoleValidator: IUserRoleValidator,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(
      "/",
      this.UserRoleValidator.changeRoles(),
      this.UserRoleController.addRoles,
    );
    this.router.delete(
      "/",
      this.UserRoleValidator.changeRoles(),
      this.UserRoleController.deleteRoles,
    );
  }
}
