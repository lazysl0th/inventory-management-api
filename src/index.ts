import "dotenv/config";
import "reflect-metadata";

import createContainer from "./infrastructure/config/container.js";
import { container } from "tsyringe";
import TerminusService from "./infrastructure/services/TerminusService.js";

createContainer();

export const terminusService = container.resolve(TerminusService);
