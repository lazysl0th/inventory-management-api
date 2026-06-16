import { createTerminus } from "@godaddy/terminus";
import http from "http";
import { WebSocketServer } from "ws";
import { terminusService } from "../../../index.js";
import express from "express";
import cors from "cors";
import { container } from "tsyringe";
import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import AppModule from "../../../module/App.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import Passport from "../../../base/Passport.js";
import { errors } from "celebrate";
import error from "../../../middlewares/error.js";
import CorsConfig from "../../config/cors.js";
import LIMITER_OPTIONS from "../../config/limiter.js";

const bootstrap = () => {
  const config = container.resolve(CONFIG_TOKEN);
  const corsConfig = container.resolve(CorsConfig);
  const app = express();
  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors(corsConfig.options));
  app.use(rateLimit(LIMITER_OPTIONS));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  const httpServer = http.createServer(app);
  const wsServer: WebSocketServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });
  const appModule = new AppModule(wsServer);
  app.use(
    Passport.initialize([
      appModule.passport.local.strategy,
      appModule.passport.jwt.strategy,
      appModule.passport.google.strategy,
      appModule.passport.facebook.strategy,
    ]),
  );
  app.use(appModule.router);
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
