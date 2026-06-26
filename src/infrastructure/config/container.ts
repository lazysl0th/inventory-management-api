import { CONFIG_TOKEN } from "#/application/configuration/interfaces/IConfig.js";
import { container } from "tsyringe";
import config from "./env.js";
import type ILogger from "#/application/services/logger/interfaces/ILogger.js";
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
import { SocketIoPublisher } from "../transport/ws/socketio/adapters/SocketIoPublisher.js";
import { EventEmitterBus } from "../transport/ws/events/EventEmitterBus.js";
import { CommentCreatedHandler } from "../transport/ws/events/handlers/CommentCreatedHandler.js";
import commentRoutes from "../transport/http/modules/comment/commentRoutes.js";
import CommentController from "../transport/http/modules/comment/CommentController.js";
import type { IWsRoute } from "../transport/ws/socketio/types/types.js";
import type { Socket } from "socket.io";
import { commentsValidationRegistry } from "#/application/inventory/dtos/WSInventoryDto.js";
import PrismaCommentRepository from "../persistence/repositories/PrismaCommentRepository.js";
import EmailService from "../services/EmailService.js";
import authRoutes from "../transport/http/modules/auth/authRoutes.js";
import authValidations, {
  AUTH_VALIDATIONS_TOKEN,
} from "../transport/http/modules/auth/authValidations.js";
import AuthController from "../transport/http/modules/auth/AuthController.js";
import BcryptService from "../services/BcryptService.js";
import JwtService from "../services/JwtService.js";
import PrismaAuthRepository from "../persistence/repositories/PrismaAuthRepository.js";
import PassportService from "../services/passport/PassportService.js";
import PassportGoogleStrategy from "../services/passport/strategies/Google.js";
import type { IAuthStrategy } from "#/application/auth/interfaces/IAuthStrategy.js";
import PassportFacebookStrategy from "../services/passport/strategies/Facebook.js";
import PassportJwtStrategy from "../services/passport/strategies/Jwt.js";
import userValidations, {
  USER_VALIDATIONS_TOKEN,
} from "../transport/http/modules/user/userValidations.js";
import userRoutes from "../transport/http/modules/user/userRoutes.js";
import PrismaUserRepository from "../persistence/repositories/PrismaUserRepository.js";
import UserController from "../transport/http/modules/user/UserController.js";
import inventoryValidations, {
  INVENTORY_VALIDATIONS_TOKEN,
} from "../transport/http/modules/inventory/inventoryValidations.js";
import InventoryController from "../transport/http/modules/inventory/InventoryController.js";
import inventoryRoutes from "../transport/http/modules/inventory/inventoryRoutes.js";
import PrismaInventoryRepository from "../persistence/repositories/PrismaInventoryRepository.js";
import itemValidations, {
  ITEM_VALIDATIONS_TOKEN,
} from "../transport/http/modules/item/itemValidations.js";
import itemRoutes from "../transport/http/modules/item/itemRoutes.js";
import ItemController from "../transport/http/modules/item/ItemController.js";
import PrismaItemRepository from "../persistence/repositories/PrismaItemRepository.js";
import likeValidations, {
  LIKE_VALIDATIONS_TOKEN,
} from "../transport/http/modules/like/likeValidations.js";
import LikeController from "../transport/http/modules/like/LikeController.js";
import likeRoutes from "../transport/http/modules/like/likeRoutes.js";
import PrismaLikeRepository from "../persistence/repositories/PrismaLikeRepository.js";
import { TextGenerator } from "../services/customId/generators/TextGenerator.js";
import { RandomNumberGenerator } from "../services/customId/generators/RandomNumberGenerator.js";
import { RandomBitsGenerator } from "../services/customId/generators/RandomBitsGenerator.js";
import { UuidGenerator } from "../services/customId/generators/UuidGenerator.js";
import { SequenceGenerator } from "../services/customId/generators/SequenceGenerator.js";
import { DateTimeGenerator } from "../services/customId/generators/DateTimeGenerator.js";
import { DateTimeFormatter } from "../services/customId/formatters/DateTimeFormatter.js";
import { DigitFormatter } from "../services/customId/formatters/DigitFormatter.js";
import { HexFormatter } from "../services/customId/formatters/HexFormatter.js";
import { CustomIdService } from "../services/customId/CustomIdService.js";
import PrismaSequenceRepository from "../persistence/repositories/PrismaSequenceRepository.js";

const createContainer = () => {
  container.register(CONFIG_TOKEN, { useValue: config });
  container.registerSingleton(CorsConfig);
  container.register<ILogger>("ILogger", { useClass: LoggerService });
  container.register("HashService", { useClass: BcryptService });
  container.register("TokenService", { useClass: JwtService });
  container.register("EmailService", { useClass: EmailService });
  container.register<IAuthStrategy>("AuthStrategy", {
    useClass: PassportGoogleStrategy,
  });
  container.register<IAuthStrategy>("AuthStrategy", {
    useClass: PassportFacebookStrategy,
  });
  container.register<IAuthStrategy>("AuthStrategy", {
    useClass: PassportJwtStrategy,
  });

  container.register("TextGenerator", {
    useClass: TextGenerator,
  });
  container.register("RandomNumberGenerator", {
    useClass: RandomNumberGenerator,
  });
  container.register("RandomBitsGenerator", {
    useClass: RandomBitsGenerator,
  });

  container.register("UuidGenerator", {
    useClass: UuidGenerator,
  });

  container.register("SequenceGenerator", {
    useClass: SequenceGenerator,
  });

  container.register("DateTimeGenerator", {
    useClass: DateTimeGenerator,
  });

  container.register("DateTimeFormatter", {
    useClass: DateTimeFormatter,
  });

  container.register("DigitFormatter", {
    useClass: DigitFormatter,
  });

  container.register("HexFormatter", {
    useClass: HexFormatter,
  });

  container.register("CustomIdService", {
    useClass: CustomIdService,
  });

  container.register("SequenceRepository", {
    useClass: PrismaSequenceRepository,
  });

  container.register<IRoute>("IRoute", {
    useFactory: (container) => {
      const routesController = container.resolve(TagController);
      return {
        path: "/tags",
        router: tagRoutes(routesController),
      };
    },
  });
  container.register("TagRepository", {
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

  container.register("CommentRepository", {
    useClass: PrismaCommentRepository,
  });

  container.register(AUTH_VALIDATIONS_TOKEN, {
    useValue: authValidations,
  });

  container.register<IRoute>("IRoute", {
    useFactory: () => {
      const authValidations = container.resolve(AUTH_VALIDATIONS_TOKEN);
      const routesController = container.resolve(AuthController);
      const authService = container.resolve(PassportService);
      return {
        path: "/",
        router: authRoutes(routesController, authValidations, authService),
      };
    },
  });

  container.register("AuthRepository", {
    useClass: PrismaAuthRepository,
  });

  container.register(USER_VALIDATIONS_TOKEN, {
    useValue: userValidations,
  });

  container.register<IRoute>("IRoute", {
    useFactory: () => {
      const userValidations = container.resolve(USER_VALIDATIONS_TOKEN);
      const routesController = container.resolve(UserController);
      const authService = container.resolve(PassportService);
      return {
        path: "/users",
        router: userRoutes(routesController, userValidations, authService),
      };
    },
  });

  container.register("UserRepository", {
    useClass: PrismaUserRepository,
  });

  container.register(INVENTORY_VALIDATIONS_TOKEN, {
    useValue: inventoryValidations,
  });

  container.register<IRoute>("IRoute", {
    useFactory: () => {
      const inventoryValidations = container.resolve(
        INVENTORY_VALIDATIONS_TOKEN,
      );
      const routesController = container.resolve(InventoryController);
      const authService = container.resolve(PassportService);
      return {
        path: "/inventories",
        router: inventoryRoutes(
          routesController,
          inventoryValidations,
          authService,
        ),
      };
    },
  });

  container.register("InventoryRepository", {
    useClass: PrismaInventoryRepository,
  });

  container.register(ITEM_VALIDATIONS_TOKEN, {
    useValue: itemValidations,
  });

  container.register<IRoute>("IRoute", {
    useFactory: (container) => {
      const itemValidations = container.resolve(ITEM_VALIDATIONS_TOKEN);
      const routesController = container.resolve(ItemController);
      return {
        path: "/inventories/:inventoryId/items",
        router: itemRoutes(routesController, itemValidations),
      };
    },
  });

  container.register("ItemRepository", {
    useClass: PrismaItemRepository,
  });

  container.register(LIKE_VALIDATIONS_TOKEN, {
    useValue: likeValidations,
  });

  container.register<IRoute>("IRoute", {
    useFactory: (container) => {
      const itemValidations = container.resolve(LIKE_VALIDATIONS_TOKEN);
      const routesController = container.resolve(LikeController);
      return {
        path: "/likes",
        router: likeRoutes(routesController, itemValidations),
      };
    },
  });

  container.register("LikeRepository", {
    useClass: PrismaLikeRepository,
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

  container.registerSingleton("SessionRepository", InMemorySessionRepository);

  container.register("SubscriptionManager", {
    useClass: SocketIoSubscriptionManager,
  });

  container.register("RealtimePublisher", {
    useClass: SocketIoPublisher,
  });

  container.registerSingleton("EventBus", EventEmitterBus);

  container.registerSingleton(CommentCreatedHandler);
};

export default createContainer;
