import { Router } from "express";
import type TagController from "./TagController.js";

const createTagRoutes = (tagController: TagController): Router => {
  const router = Router();
  router.get("/", tagController.getTags);
  return router;
};

export default createTagRoutes;
