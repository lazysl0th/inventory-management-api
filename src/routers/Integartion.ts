import Router from "../base/Router.js";
import type { IIntegrationController } from "../types/controllers/Integration.js";
import type { IIntegrationRouter } from "../types/routers/Integration.js";
import type { ISalesForceRouter } from "../types/routers/SalesForce.js";

export default class IntegrationRouter
  extends Router
  implements IIntegrationRouter
{
  constructor(
    private readonly IntegrationController: IIntegrationController,
    private readonly SalesForceRouter: ISalesForceRouter,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post(
      "/cloudinary",
      this.IntegrationController.multerSettingsUpload.single("image"),
      this.IntegrationController.uploadImageToCloudinary,
    );
    this.router.post(
      "/dropbox",
      this.IntegrationController.uploadJsonToDropbox,
    );
    this.router.use("/salesForce", this.SalesForceRouter.router);
  }
}
