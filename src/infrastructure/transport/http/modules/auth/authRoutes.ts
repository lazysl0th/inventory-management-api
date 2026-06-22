import { Router } from "express";
import type { IAuthValidations } from "./authValidations.js";
import type AuthController from "./AuthController.js";
import type PassportService from "#/infrastructure/services/passport/PassportService.js";

const authRoutes = (
  authController: AuthController,
  authValidations: IAuthValidations,
  authService: PassportService,
): Router => {
  const router = Router();

  router.post(
    "/signup",
    authValidations.signup,
    authController.registerByCredentials,
  );

  router.post(
    "/signin",
    authValidations.signin,
    authController.loginByCredentials,
  );
  router.get("/refreshAccessToken", authController.refreshAccessToken);
  router.get("/signout", authController.logoutUser);
  router.get(
    "/signin/google",
    authService.passport.authenticate("google", {
      session: false,
      authInfo: true,
      scope: ["email", "profile"],
    }),
  );
  router.get(
    "/signin/google/callback",
    authService.passport.authenticate("google", {
      session: false,
      authInfo: true,
      failureRedirect: "/signin?error=google",
    }),
    authController.loginUserBySocials,
  );
  router.get(
    "/signin/facebook",
    authService.passport.authenticate("facebook", {
      session: false,
      authInfo: true,
      scope: ["email"],
    }),
  );
  router.get(
    "/signin/facebook/callback",
    authService.passport.authenticate("facebook", {
      session: false,
      authInfo: true,
      failureRedirect: "/signin?error=facebook",
    }),
    authController.loginUserBySocials,
  );
  router.post(
    "/resetPassword",
    authValidations.resetPassword,
    authController.resetUserPassword,
  );
  router.post(
    "/changePassword",
    authValidations.changePassword,
    authController.changeUserPassword,
  );
  return router;
};

export default authRoutes;
