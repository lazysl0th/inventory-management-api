import { Socket } from "socket.io";

export interface IWsRoute {
  register(socket: Socket): void;
}
