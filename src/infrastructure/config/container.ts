import { CONFIG_TOKEN } from "../../application/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";
import type ILogger from "../../application/interfaces/ILogger.js";
import LoggerService from "../services/LoggerService.js";

const createContainer = () => {
  container.register(CONFIG_TOKEN, { useValue: config });
  container.register<ILogger>("ILogger", { useClass: LoggerService });
};

export default createContainer;
