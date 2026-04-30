import { WebSocketServer, type RawData } from "ws";
import type { IncomingMessage } from "http";
import { isClientMessage } from "../../utils.js";
import type { AliveWebSocket, IMessageHandler, IWsService, TChannel, TClientData } from "../../types/services/Ws.js";

export default class WsService implements IWsService {
  private readonly wsServer: WebSocketServer;
  private clients = new Set<AliveWebSocket>();
  private channels = new Map<TChannel, Set<AliveWebSocket>>();
  private heartbeatInterval?: NodeJS.Timeout;
  private messageHandlers = new Map<string, IMessageHandler>();

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
    this.init();
  }

  private init() {
    this.wsServer.on("connection", (ws: AliveWebSocket, req) =>
      this.handleConnection(ws, req)
    );

    this.startHeartbeat();
  }

  registerHandlers(messageHandlers: IMessageHandler[]): void {
      messageHandlers.forEach((messageHandler) => this.messageHandlers.set(messageHandler.type, messageHandler));
  }

  private handleConnection(ws: AliveWebSocket, req: IncomingMessage) {
    ws.isAlive = true;
    this.clients.add(ws);
    ws.on("message", (msg) => this.handleMessage(ws, msg));
    ws.on("pong", () => this.handlePong(ws));
    ws.on("close", () => this.handleClose(ws));
    ws.send(JSON.stringify({ type: "CONNECTED" }));
  }

  private handleMessage(ws: AliveWebSocket, message: RawData) {
    try {
      const data: unknown = JSON.parse(message.toString());
      if (!isClientMessage(data)) {
        console.warn("Invalid message shape");
        return;
      }
      this.routeMessage(ws, data);
    } catch (e) {
      console.error("Invalid JSON message");
    }
  }

  private routeMessage(ws: AliveWebSocket, data: TClientData) {
    const messageHandler = this.messageHandlers.get(data.type);

    if (!messageHandler) {
      console.warn("Unknown message type:", data.type);
      return;
    }

    messageHandler.handle(ws, data);
  }

  subscribe(ws: AliveWebSocket, channel: TChannel): void {
    if (!this.channels.has(channel)) this.channels.set(channel, new Set());
    this.channels.get(channel)!.add(ws);
  }

  unsubscribe(ws: AliveWebSocket, channel: TChannel): void {
    this.channels.get(channel)?.delete(ws);
    if (this.channels.get(channel)?.size === 0) {
      this.channels.delete(channel);
    }
  }

  private publish(channel: TChannel, payload: unknown) {
    const clients = this.channels.get(channel);
    if (!clients) return;
    clients.forEach((ws) => this.send(ws, payload));
  }

  notify(channel: TChannel, payload: unknown): void {
    this.publish(channel, payload);
  }

  private broadcast(data: unknown) {
    this.clients.forEach((ws) => this.send(ws, data));
  }

  private send(ws: AliveWebSocket,  data: unknown) {
    const message = JSON.stringify(data);
    if (ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(message);
    } catch (e) {
      console.error("WS send error:", e);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          ws.terminate();
          this.cleanup(ws);
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  private handlePong(ws: AliveWebSocket) {
    ws.isAlive = true;
  }

  private handleClose(ws: AliveWebSocket) {
    this.cleanup(ws);
  }

  private cleanup(ws: AliveWebSocket) {
    this.clients.delete(ws);
    this.channels.forEach((clients, channel) => {
      clients.delete(ws);
      if (clients.size === 0) this.channels.delete(channel);
    });
  }

  stop(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    this.clients.forEach((ws) => ws.terminate());
    this.clients.clear();
    this.channels.clear();
  }
}