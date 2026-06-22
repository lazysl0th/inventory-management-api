import type { IIntegrationController } from "../types/controllers/Integration.js";
import Router from "../base/Router.js";
import type { IBaseRouter } from "../types/base/Router.js";
import type { IIntegrationValidator } from "../types/validators/Integration.js";

export default class SalesForceRouter extends Router implements IBaseRouter {
  constructor(
    private readonly SalesForceController: IIntegrationController,
    private readonly IntegrationValidator: IIntegrationValidator,
  ) {
    super();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    //this.router.use(Passport.authorize("jwt"));
    this.router.get(
      "/address",
      this.SalesForceController.getLocationFromSalesForce,
    );
    this.router.post(
      "/addInfo/:userId",
      this.IntegrationValidator.addAditionalInfo(),
      this.SalesForceController.addAdditionalInfoToSalesForce,
    );
    this.router.post(
      "/getInfo/:userId",
      this.IntegrationValidator.addAditionalInfo(),
      this.SalesForceController.getAdditionalInfoFromSalesForce,
    );
  }
}
