import { CONFIG_TOKEN } from "#/application/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";

const createContainer = () => {
  container.register(CONFIG_TOKEN, { useValue: config });
};

export default createContainer;
