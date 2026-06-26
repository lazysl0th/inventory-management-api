import { Router } from "express";
import type SalesForceController from "./SalesForceController.js";
import type { ISalesForceValidations } from "./salesForceValidations.js";

const salesForceRoutes = (
  salesForceController: SalesForceController,
  salesForceValidations: ISalesForceValidations,
) => {
  const router = Router();
  //this.router.use(Passport.authorize("jwt"));
  router.get("/address", salesForceController.getLocation);
  router.post(
    "/addInfo/:userId",
    salesForceValidations.addInfo,
    salesForceController.addAdditionalInfo,
  );
  router.post(
    "/getInfo/:userId",
    salesForceValidations.getInfo,
    salesForceController.getAdditionalInfo,
  );
  return router;
};

export default salesForceRoutes;
