import { Router } from "express";
import type CloudinaryController from "./CloudinaryController.js";

const cloudinaryRoutes = (cloudinaryController: CloudinaryController) => {
  const router = Router();
  router.post("/", cloudinaryController.uploadImageToCloudinary);
  return router;
};

export default cloudinaryRoutes;
