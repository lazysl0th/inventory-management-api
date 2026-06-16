import UserRoleController from "../controllers/UserRole.js";
import UserRoleModel from "../models/UserRole.js";
import UserRoleRouter from "../routers/UserRole.js";
import UserRoleService from "../services/UserRole.js";
import UserRoleValidator from "../validators/UserRole.js";

export default class UserRoleModule {
  public readonly router: UserRoleRouter;

  constructor() {
    const service = new UserRoleService(new UserRoleModel());
    const controller = new UserRoleController(service);
    this.router = new UserRoleRouter(controller, new UserRoleValidator());
  }
}
