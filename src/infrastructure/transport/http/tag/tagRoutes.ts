import { Router } from "express";
import type { ITagController } from "../../../../types/controllers/Tag.js";

const createTagRoutes = (tagController: ITagController): Router => {
  const router = Router();
  router.get("/", tagController.getTags);
  return router;
};

export default createTagRoutes;
