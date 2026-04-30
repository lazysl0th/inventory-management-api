import { WebSocket } from "ws";


export type AliveWebSocket = WebSocket & {
  isAlive: boolean;
  userId?: string;
};

export type TChannel = string;

export type TMessage = 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'PING' | 'COMMENT_CREATE'

export interface TClientData {
  type: TMessage;
  channel: string;
}

export interface IMessageHandler {
  type: TMessage;
  handle(ws: AliveWebSocket, data: TClientData): void;
}



export type TAliveWebSocket = WebSocket & {
  isAlive: boolean;
  userId?: string;
};

export interface TClientData {
  type: TMessage;
  channel: string;
}

export interface IMessageHandler {
  type: TMessage;
  handle(ws: AliveWebSocket, data: TClientData): void;
}

export interface IWsService {
    registerHandlers(messageHandlers: IMessageHandler[]): void;
    subscribe(ws: AliveWebSocket, channel: TChannel): void;
    notify(channel: TChannel, payload: unknown): void;
    stop(): void;
}