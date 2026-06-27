import { createTerminus } from "@godaddy/terminus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { container } from "tsyringe";
import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errors } from "celebrate";
import error from "./middlewares/error.js";
import CorsConfig from "../../config/cors.js";
import LIMITER_OPTIONS from "../../config/limiter.js";
import type { IRoute } from "./types/types.js";
import SocketIO from "../ws/socketio/socketio.js";
import { CommentCreatedHandler } from "../ws/events/handlers/CommentCreatedHandler.js";
import type { IAuthStrategy } from "#/application/auth/interfaces/IAuthStrategy.js";
import multer from "multer";
import MulterConfig from "#/infrastructure/config/multer.js";
import TerminusService from "#/infrastructure/services/TerminusService.js";
import type ILogger from "#/application/services/logger/interfaces/ILogger.js";
import type { ITranslator } from "#/application/services/translator/interfaces/ITranslator.js";
import createContainer from "#/infrastructure/config/container.js";

const bootstrap = async () => {
  createContainer();
  const config = container.resolve(CONFIG_TOKEN);
  const corsConfig = container.resolve(CorsConfig);
  const multerConfig = container.resolve(MulterConfig);
  const routes = container.resolveAll<IRoute>("IRoute");
  const authStrategies = container.resolveAll<IAuthStrategy>("AuthStrategy");
  const logger = container.resolve<ILogger>("ILogger");
  const i18n = container.resolve<ITranslator>("ITranslator");
  const initPersistences =
    container.resolveAll<Promise<void>>("InitPersistence");
  await Promise.all(initPersistences);
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors(corsConfig.options));
  app.use(rateLimit(LIMITER_OPTIONS));
  app.use(multer(multerConfig.options).single("image"));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  const httpServer = createServer(app);
  const socketIo = container.resolve(SocketIO);
  socketIo.attach(httpServer);
  container.resolve(CommentCreatedHandler);
  authStrategies.forEach((strategy) => strategy.register());
  routes.forEach((route) => app.use(route.path, route.router));
  app.use(errors());
  app.use(error);
  const terminusService = container.resolve(TerminusService);
  createTerminus(httpServer, terminusService.options());

  httpServer.on("error", (error: NodeJS.ErrnoException): void => {
    if (error.code === "EADDRINUSE") {
      logger.error(
        { port: config.PORT, error },
        `Port ${config.PORT} is already in use`,
      );
    } else {
      logger.error({ error }, "Critical error starting server");
    }
    process.exitCode = 1;
    httpServer.close();
  });

  httpServer.listen(config.PORT, () => {
    logger.info(`The server has successfully started on port ${config.PORT}`);
  });

  process.on("uncaughtException", (err: Error): void => {
    logger.error({ err }, i18n.t("server.critical_error"));
    process.emit("SIGTERM");
  });

  process.on("unhandledRejection", (err: Error): void => {
    logger.error({ err }, i18n.t("server.critical_error"));
    process.emit("SIGTERM");
  });
};

export default bootstrap;
