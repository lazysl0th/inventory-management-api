import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";
import type ILogger from "#/application/logger/interfaces/ILogger.js";
import LoggerService from "../services/LoggerService.js";
import CorsConfig from "./cors.js";
import type { IRoute } from "../transport/http/types.js";
import createTagRoutes from "../transport/http/tag/tagRoutes.js";
import TagModel from "../../models/Tag.js";
import TagController from "../transport/http/tag/TagController.js";

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
    useClass: TagModel,
  });
};

export default createContainer;
