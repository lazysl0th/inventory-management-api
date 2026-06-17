import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";
import type ILogger from "#/application/logger/interfaces/ILogger.js";
import LoggerService from "../services/LoggerService.js";
import CorsConfig from "./cors.js";
import type { IRoute } from "../transport/http/types.js";
import createTagRoutes from "../transport/http/tag/tagRoutes.js";
import PrismaTagRepository from "../persistence/repositories/PrismaTagRepository.js";
import TagController from "../transport/http/tag/TagController.js";
import Prisma from "../persistence/prisma/prisma.js";

const createContainer = () => {
  container.register(CONFIG_TOKEN, { useValue: config });
  container.registerSingleton(CorsConfig);
  container.register<ILogger>("ILogger", { useClass: LoggerService });
  container.register<IRoute>("IRoute", {
    useFactory: (controller) => {
      const routesController = controller.resolve(TagController);
      return {
        path: "/tags",
        router: createTagRoutes(routesController),
      };
    },
  });
  container.register("ITagRepository", {
    useClass: PrismaTagRepository,
  });

  container.register<Promise<void>>("InitPersistence", {
    useFactory: async (dbclient) => {
      const prismaCLient = dbclient.resolve(Prisma);
      await prismaCLient.connect();
    },
  });
};

export default createContainer;
