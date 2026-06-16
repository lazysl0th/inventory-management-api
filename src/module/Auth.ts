import AuthController from "../controllers/Auth.js";
import AuthRouter from "../routers/Auth.js";
import AuthService from "../services/Auth.js";
import EmailService from "../services/Email.js";
import UserService from "../services/User.js";
import AuthValidator from "../validators/Auth.js";

export default class AuthModule {
  public readonly service: AuthService;
  public readonly router: AuthRouter;

  constructor(userService: UserService) {
    const { service, router } = this.init(userService);
    this.service = service;
    this.router = router;
  }

  private init(userService: UserService) {
    const service = new AuthService(userService, new EmailService());
    const controller = new AuthController(service);
    const router = new AuthRouter(controller, new AuthValidator());
    return { service, router };
  }
}
