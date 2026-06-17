import "dotenv/config";
import "reflect-metadata";

import createContainer from "#/infrastructure/config/container.js";
import { container } from "tsyringe";
import TerminusService from "#/infrastructure/services/TerminusService.js";
import bootstrap from "#/infrastructure/transport/http/server.js";

createContainer();

export const terminusService = container.resolve(TerminusService);

const initPersistences = container.resolveAll<Promise<void>>("InitPersistence");
await Promise.all(initPersistences);

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled rejection:", reason);
});

bootstrap();
