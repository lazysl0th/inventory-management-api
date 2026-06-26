import { inject, singleton } from "tsyringe";
import SocketIO from "#/infrastructure/transport/ws/socketio/socketio.js";
import type { IRealtimePublisher } from "#/application/services/realtime/interfaces/IRealtimePublisher.js";

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
