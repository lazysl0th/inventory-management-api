import type { IRealtimePublisher } from "#/application/realtime/interfaces/IRealtimePublisher.js";
import { inject, singleton } from "tsyringe";
import SocketIO from "#/infrastructure/transport/ws/socketio/socketio.js";

@singleton()
export class SocketIoPublisher<T> implements IRealtimePublisher<T> {
  constructor(@inject(SocketIO) private socket: SocketIO) {}

  async publishToUser(
    userId: string,
    event: string,
    payload: T,
  ): Promise<void> {
    this.socket.io.to(`user:${userId}`).emit(event, payload);
  }

  async publishToChannel(
    channel: string,
    event: string,
    payload: T,
  ): Promise<void> {
    this.socket.io.to(channel).emit(event, payload);
  }

  async broadcast<T>(eventName: string, payload: T): Promise<void> {
    this.socket.io.emit(eventName, payload);
  }
}
