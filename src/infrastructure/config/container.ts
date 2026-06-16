import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";
import type ILogger from "#/application/logger/interfaces/ILogger.js";
import LoggerService from "../services/LoggerService.js";
import CorsConfig from "./cors.js";

const createContainer = () => {
  container.register(CONFIG_TOKEN, { useValue: config });
  container.registerSingleton(CorsConfig);
  container.register<ILogger>("ILogger", { useClass: LoggerService });
};

export default createContainer;
