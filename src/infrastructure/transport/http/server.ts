import { createTerminus } from "@godaddy/terminus";
import { createServer } from "http";
import { terminusService } from "../../../index.js";
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

const bootstrap = () => {
  const config = container.resolve(CONFIG_TOKEN);
  const corsConfig = container.resolve(CorsConfig);
  const multerConfig = container.resolve(MulterConfig);
  const routes = container.resolveAll<IRoute>("IRoute");
  const authStrategies = container.resolveAll<IAuthStrategy>("AuthStrategy");
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

  createTerminus(httpServer, terminusService.options());

  httpServer.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") throw error;

    const bind =
      typeof config.PORT === "string"
        ? `Pipe ${config.PORT}`
        : `Port ${config.PORT}`;

    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} already in use by another process`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  httpServer.listen(config.PORT, () => {
    console.log(`The server has successfully started on port ${config.PORT}`);
  });
};

export default bootstrap;
