import UserController from "../controllers/User.js";
import UserModel from "../models/User.js";
import UserRouter from "../routers/User.js";
import UserService from "../services/User.js";
import UserValidator from "../validators/User.js";

export default class UserModule {
    public readonly service: UserService;
    public readonly router: UserRouter;

    constructor() {
        const { service, router } = this.init()
        this.service = service
        this.router = router;
    }

    private init() {
        const service = new UserService(new UserModel());
        const controller = new UserController(service);
        const router = new UserRouter(controller, new UserValidator());
        return { service, router }
    }
}