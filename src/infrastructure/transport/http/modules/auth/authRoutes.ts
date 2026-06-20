import { Router } from "express";
import type { IAuthController } from "../../../../../types/controllers/Auth.js";
import Passport from "../../../../../base/Passport.js";
import type { IAuthValidations } from "./authValidations.js";

const authRoutes = (
  authController: IAuthController,
  authValidations: IAuthValidations,
): Router => {
  const router = Router();
  router.post("/signup", authValidations.signup, authController.registerUser);
  router.post(
    "/signin",
    authValidations.signin,
    Passport.authorize("local"),
    authController.loginUserByEmail,
  );
  router.get("/refreshAccessToken", authController.refreshAccessToken);
  router.get("/signout", authController.logoutUser);
  router.get(
    "/signin/google",
    Passport.authorize("google", { scope: ["email", "profile"] }),
  );
  router.get(
    "/signin/google/callback",
    Passport.authorize("google", { failureRedirect: "/signin?error=google" }),
    authController.loginUserBySocials,
  );
  router.get(
    "/signin/facebook",
    Passport.authorize("facebook", { scope: ["email"] }),
  );
  router.get(
    "/signin/facebook/callback",
    Passport.authorize("facebook", {
      failureRedirect: "/signin?error=facebook",
    }),
    authController.loginUserBySocials,
  );
  router.post(
    "/resetPassword",
    authValidations.resetPassword,
    authController.resetUserPassword,
  );
  router.post("/changePassword", authController.changeUserPassword);
  return router;
};

export default authRoutes;
