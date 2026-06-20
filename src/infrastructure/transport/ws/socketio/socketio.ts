import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { container, inject, singleton } from "tsyringe";
import CorsConfig from "#/infrastructure/config/cors.js";
import ConnectUser from "#/application/realtime/use-cases/connection-management/ConnectUser.js";
import DisconnectUser from "#/application/realtime/use-cases/connection-management/DisconnectUser.js";
import {
  wsValidate,
  type TWsValidationRegistry,
} from "./middlewares/wsValidation.js";
import { randomUUID } from "crypto";
import type { IWsRoute } from "./types/types.js";

@singleton()
export default class SocketIO {
  public readonly io: SocketIOServer;

  constructor(
    @inject(CorsConfig) private readonly corsConfig: CorsConfig,
    @inject(ConnectUser) private readonly connectUser: ConnectUser,
    @inject(DisconnectUser) private readonly disconnectUser: DisconnectUser,
  ) {
    this.io = new SocketIOServer({
      cors: this.corsConfig.options,
      pingTimeout: 60000,
      pingInterval: 25000,
    });
    this.setupMiddlewares();
  }

  public attach(server: HttpServer) {
    const wsRoutes = container.resolveAll<IWsRoute>("IWsRoute");
    const validationRegistries = Object.assign(
      {},
      ...container.resolveAll<TWsValidationRegistry>("IWsValidationRegistry"),
    );
    this.setupConnection(wsRoutes, validationRegistries);
    this.io.attach(server);
  }

  private setupMiddlewares() {
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      if (token) {
        try {
          const user = token;
          socket.data.userId = user.id;
          socket.data.isAuthenticated = true;
        } catch (err) {
          console.error("[Socket.IO] Invalid token from", socket.id, err);
          socket.data.userId = randomUUID();
          socket.data.isAuthenticated = false;
        }
      } else {
        socket.data.userId = randomUUID();
        socket.data.isAuthenticated = false;
      }
      next();
    });
  }

  private setupConnection(
    wsRoutes: IWsRoute[],
    validationRegistries: TWsValidationRegistry,
  ) {
    this.io.on("connection", (socket: Socket) =>
      this.handleSocketConnection(socket, wsRoutes, validationRegistries),
    );
  }

  private handleSocketConnection(
    socket: Socket,
    wsRoutes: IWsRoute[],
    validationRegistries: TWsValidationRegistry,
  ) {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    socket.join(`user:${socket.data.userId}`);
    this.connectUser.execute({
      connectionId: socket.id,
      userId: socket.data.userId,
      isAuthenticated: socket.data.isAuthenticated,
    });
    socket.use(wsValidate(validationRegistries));
    wsRoutes.forEach((route) => route.register(socket));
    socket.on("error", (err) => this.handleSocketError(socket, err));
    socket.on("disconnect", (reason) =>
      this.handleSocketDisconnect(socket, reason),
    );
  }

  private handleSocketError(socket: Socket, err: Error) {
    console.error(`[Socket.IO] Error on socket ${socket.id}:`, err);
  }

  private handleSocketDisconnect(socket: Socket, reason: string) {
    this.disconnectUser.execute({ userId: socket.data.userId });
    console.log(
      `[Socket.IO] Client disconnected: ${socket.id}, reason: ${reason}`,
    );
  }
}
