import { Router } from "express";
import type TagController from "./TagController.js";

const tagRoutes = (tagController: TagController): Router => {
  const router = Router();
  router.get("/", tagController.getTags);
  return router;
};

export default tagRoutes;
