import { DROPBOX, SALES_FORCE } from "../constants/integration.js";
import IntegrationController from "../controllers/Integration.js";
import IntegrationRouter from "../routers/Integartion.js";
import SalesForceRouter from "../routers/SalesForce.js";
import CloudinaryApi from "../services/api/Cloudinary.js";
import DropboxApi from "../services/api/Dropbox.js";
import SalesForceApi from "../services/api/SalesForce.js";
import IntegrationService from "../services/Integration.js";
import type { IUserService } from "../types/services/User.js";
import IntegrationValidator from "../validators/Integration.js";

export default class IntegrationModule {
    public readonly router: IntegrationRouter;

    constructor(userService: IUserService) {
        this.router = this.init(userService);
    }

    private init(userService: IUserService) {
        const dropboxApi = new DropboxApi(DROPBOX.BASE_URL, DROPBOX.CONTENT_URL);
        const cloudinaryApi = new CloudinaryApi();
        const salesForceApi = new SalesForceApi(SALES_FORCE.BASE_URL);
        const service = new IntegrationService(cloudinaryApi, userService, dropboxApi, salesForceApi);
        const controller = new IntegrationController(service);
        const integrationValidator = new IntegrationValidator();
        const salesForceRouter = new SalesForceRouter(controller, integrationValidator);
        return new IntegrationRouter(controller, salesForceRouter);
    }
}