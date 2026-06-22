import PrismaUserRepository from "#/infrastructure/persistence/repositories/PrismaUserRepository.js";
import UserController from "../controllers/User.js";
import UserRouter from "../routers/User.js";
import UserService from "../services/User.js";

export default class UserModule {
  public readonly service: UserService;
  public readonly router: UserRouter;

  constructor() {
    const { service, router } = this.init();
    this.service = service;
    this.router = router;
  }

  private init() {
    const service = new UserService(new PrismaUserRepository());
    const controller = new UserController(service);
    const router = new UserRouter(controller);
    return { service, router };
  }
}
