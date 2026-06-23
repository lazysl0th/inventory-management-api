import GetEmailAdmins from "#/application/user/use-cases/GetEmailAdmins.js";
import { container } from "tsyringe";
import { DROPBOX, SALES_FORCE } from "../constants/integration.js";
import IntegrationController from "../controllers/Integration.js";
import IntegrationRouter from "../routers/Integartion.js";
import SalesForceRouter from "../routers/SalesForce.js";
import CloudinaryApi from "../services/api/Cloudinary.js";
import DropboxApi from "../services/api/Dropbox.js";
import SalesForceApi from "../services/api/SalesForce.js";
import IntegrationService from "../services/Integration.js";
import IntegrationValidator from "../validators/Integration.js";
import GetUser from "#/application/user/use-cases/GetUser.js";

export default class IntegrationModule {
  public readonly router: IntegrationRouter;

  constructor() {
    this.router = this.init();
  }

  private init() {
    const dropboxApi = new DropboxApi(DROPBOX.BASE_URL, DROPBOX.CONTENT_URL);
    const cloudinaryApi = new CloudinaryApi();
    const salesForceApi = new SalesForceApi(SALES_FORCE.BASE_URL);
    const getEmailAdmins = container.resolve(GetEmailAdmins);
    const getUser = container.resolve(GetUser);
    const service = new IntegrationService(
      cloudinaryApi,
      getEmailAdmins,
      getUser,
      dropboxApi,
      salesForceApi,
    );
    const controller = new IntegrationController(service);
    const integrationValidator = new IntegrationValidator();
    const salesForceRouter = new SalesForceRouter(
      controller,
      integrationValidator,
    );
    return new IntegrationRouter(controller, salesForceRouter);
  }
}
