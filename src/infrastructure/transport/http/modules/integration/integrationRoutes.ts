import { Router } from "express";
import type { IRoute } from "../../types/types.js";

const integrationRoutes = (integrationRoutes: IRoute[]) => {
  const router = Router();
  integrationRoutes.forEach((route) => router.use(route.path, route.router));
  return router;
};

export default integrationRoutes;
