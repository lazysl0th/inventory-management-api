import { type IUserValidations } from "#/infrastructure/transport/http/modules/user/userValidations.js";
import { Router } from "express";
import type UserController from "./UserController.js";
import type PassportService from "#/infrastructure/services/passport/PassportService.js";

const userRoutes = (
  userController: UserController,
  userValidations: IUserValidations,
  authService: PassportService,
): Router => {
  const router = Router();
  router.get("/me", authService.jwtAuth, userController.getUserProfile);
  router.get("/:userId", userValidations.getUser, userController.getUser);
  router.patch(
    "/:userId",
    userValidations.updateUser,
    authService.passport.authenticate("jwt", { session: false }),
    userController.updateUser,
  );
  //this.router.use(Passport.authorize("jwt", ["Admin"]));
  router.get("/", userController.getUsers);
  //router.patch("/status", userController.updateUsersStatus);
  router.patch("/", userValidations.updateUsers, userController.updateUsers);
  router.delete("/", userValidations.deleteUsers, userController.deleteUsers);
  return router;
};

export default userRoutes;
