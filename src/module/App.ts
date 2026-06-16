import { type WebSocketServer } from "ws";
import IndexRouter from "../routers/Index.js";
import WsService from "../services/ws/Ws.js";
import AuthModule from "./Auth.js";
import IntegrationModule from "./Integration.js";
import InventoryModule from "./Inventory.js";
import ItemModule from "./Item.js";
import PassportStrategyModule from "./PassportStrategy.js";
import TagModule from "./Tag.js";
import UserModule from "./User.js";
import UserRoleModule from "./UserRole.js";
import CommentModule from "./Comment.js";
import type { IRouter } from "express";
import {
  PingHandler,
  SubscribeHandler,
  UnsubscribeHandler,
} from "../services/ws/MessageHandlers.js";

export default class AppModule {
  public readonly router: IRouter;
  public readonly passport: PassportStrategyModule;

  constructor(wsServer: WebSocketServer) {
    const { passport, indexRouter } = this.init(wsServer);
    this.passport = passport;
    this.router = indexRouter.router;
  }

  private init(wsServer: WebSocketServer) {
    const wsService = new WsService(wsServer);
    wsService.registerHandlers([
      new PingHandler(),
      new SubscribeHandler(wsService),
      new UnsubscribeHandler(wsService),
    ]);
    const tag = new TagModule();
    const user = new UserModule();
    const userRole = new UserRoleModule();
    const auth = new AuthModule(user.service);
    const integration = new IntegrationModule(user.service);
    const inventory = new InventoryModule();
    const item = new ItemModule(inventory.service);
    const comment = new CommentModule(wsService);

    const passport = new PassportStrategyModule(auth.service, user.service);
    const indexRouter = new IndexRouter(
      tag.router,
      auth.router,
      user.router,
      userRole.router,
      inventory.router,
      item.router,
      comment.router,
      integration.router,
    );
    return { passport, indexRouter };
  }
}
