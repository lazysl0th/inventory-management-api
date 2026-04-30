import type { ICommentService } from "../../types/services/Comment.js";
import type WsService from "./Ws.js";
import type { AliveWebSocket, IMessageHandler, TClientData, TMessage } from "./Ws.js";

export class PingHandler implements IMessageHandler {
  type: TMessage = 'PING';

  handle(ws: AliveWebSocket) {
    ws.send(JSON.stringify({ type: 'PONG' }));
  }
}

export class SubscribeHandler<T> implements IMessageHandler {
  type: TMessage = 'SUBSCRIBE';

  constructor(private wsService: WsService) {}

  handle(ws: AliveWebSocket, data: TClientData) {
    this.wsService.subscribe(ws, data.channel);
  }
}

export class UnsubscribeHandler implements IMessageHandler {
  type: TMessage = "UNSUBSCRIBE";

  constructor(private wsService: WsService) {}

  handle(ws: AliveWebSocket, data: TClientData) {
    this.wsService.unsubscribe(ws, data.channel);
  }
}