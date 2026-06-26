import { Router } from "express";
import type DropboxController from "./DropboxController.js";

const dropboxRoutes = (integrationController: DropboxController) => {
  const router = Router();
  router.post("/dropbox", integrationController.uploadJson);
  return router;
};

export default dropboxRoutes;
