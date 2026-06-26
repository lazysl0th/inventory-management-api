import { Router } from "express";
import type RoleController from "./RoleController.js";
import type { IRoleValidations } from "./roleValidations.js";

const roleRoutes = (
  roleController: RoleController,
  roleValidations: IRoleValidations,
) => {
  const router = Router();
  router.post("/", roleValidations.changeRoles, roleController.addRoles);
  router.delete("/", roleValidations.changeRoles, roleController.deleteRoles);
  return router;
};

export default roleRoutes;
