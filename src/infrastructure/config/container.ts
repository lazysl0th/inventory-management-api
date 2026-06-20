import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";
import type ILogger from "#/application/logger/interfaces/ILogger.js";
import LoggerService from "../services/LoggerService.js";
import CorsConfig from "./cors.js";
import type { IRoute } from "../transport/http/types/types.js";
import tagRoutes from "../transport/http/modules/tag/tagRoutes.js";
import PrismaTagRepository from "../persistence/repositories/PrismaTagRepository.js";
import TagController from "../transport/http/modules/tag/TagController.js";
import Prisma from "../persistence/prisma/prisma.js";
import commentValidations, {
  СOMMENT_VALIDATIONS_TOKEN,
} from "../transport/http/modules/comment/commentValidations.js";
import { InMemorySessionRepository } from "../persistence/repositories/InMemorySessionRepository.js";
import wsInventoryRoutes from "../transport/ws/socketio/modules/inventory/wsInventoryRoutes.js";
import WsCommentController from "../transport/ws/socketio/modules/inventory/WSInventoryController.js";
import { SocketIoSubscriptionManager } from "../transport/ws/socketio/adapters/SocketIoSubscriptionManager.js";
import InventoryModel from "../../models/Inventory.js";
import { SocketIoPublisher } from "../transport/ws/socketio/adapters/SocketIoPublisher.js";
import { EventEmitterBus } from "../transport/ws/events/EventEmitterBus.js";
import { CommentCreatedHandler } from "../transport/ws/events/handlers/CommentCreatedHandler.js";
import commentRoutes from "../transport/http/modules/comment/commentRoutes.js";
import CommentController from "../transport/http/modules/comment/CommentController.js";
import type { IWsRoute } from "../transport/ws/socketio/types/types.js";
import type { Socket } from "socket.io";
import { commentsValidationRegistry } from "#/application/inventory/dtos/WSInventoryDto.js";
import PrismaCommentRepository from "../persistence/repositories/PrismaCommentRepository.js";
import AuthService from "../../services/Auth.js";
import EmailService from "../../services/Email.js";
import UserModule from "../../module/User.js";
import AuthController from "../../controllers/Auth.js";
import authRoutes from "../transport/http/modules/auth/authRoutes.js";
import AuthValidator from "../../validators/Auth.js";

const createContainer = () => {
  container.register(CONFIG_TOKEN, { useValue: config });
  container.registerSingleton(CorsConfig);
  container.register<ILogger>("ILogger", { useClass: LoggerService });
  container.register<IRoute>("IRoute", {
    useFactory: (container) => {
      const routesController = container.resolve(TagController);
      return {
        path: "/tags",
        router: tagRoutes(routesController),
      };
    },
  });
  container.register("ITagRepository", {
    useClass: PrismaTagRepository,
  });

  container.register(СOMMENT_VALIDATIONS_TOKEN, {
    useValue: commentValidations,
  });

  container.register<IRoute>("IRoute", {
    useFactory: (container) => {
      const commentValidations = container.resolve(СOMMENT_VALIDATIONS_TOKEN);
      const routesController = container.resolve(CommentController);
      return {
        path: "/comments",
        router: commentRoutes(routesController, commentValidations),
      };
    },
  });

  container.register<IRoute>("IRoute", {
    useFactory: () => {
      const user = new UserModule();
      const service = new AuthService(user.service, new EmailService());
      const controller = new AuthController(service);
      //const commentValidations = container.resolve(СOMMENT_VALIDATIONS_TOKEN);
      //const routesController = container.resolve(CommentController);
      return {
        path: "/",
        router: authRoutes(controller, new AuthValidator()),
      };
    },
  });

  container.register("ITagRepository", {
    useClass: PrismaTagRepository,
  });

  container.register("ICommentRepository", {
    useClass: PrismaCommentRepository,
  });

  container.register("IInventoryRepository", {
    useClass: InventoryModel,
  });

  container.register("IWsValidationRegistry", {
    useValue: commentsValidationRegistry,
  });

  container.register<IWsRoute>("IWsRoute", {
    useFactory: (container) => {
      const commentController = container.resolve(WsCommentController);
      return {
        register: (socket: Socket) => {
          wsInventoryRoutes(socket, commentController);
        },
      };
    },
  });

  container.register<Promise<void>>("InitPersistence", {
    useFactory: async (dbclient) => {
      const prismaCLient = dbclient.resolve(Prisma);
      await prismaCLient.connect();
    },
  });

  container.registerSingleton("ISessionRepository", InMemorySessionRepository);

  container.register("ISubscriptionManager", {
    useClass: SocketIoSubscriptionManager,
  });

  container.register("IRealtimePublisher", {
    useClass: SocketIoPublisher,
  });

  container.registerSingleton("IEventBus", EventEmitterBus);

  container.registerSingleton(CommentCreatedHandler);
};

export default createContainer;
