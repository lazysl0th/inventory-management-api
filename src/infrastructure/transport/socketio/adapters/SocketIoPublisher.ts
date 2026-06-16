import type { IRealtimePublisher } from "#/application/realtime/interfaces/IRealtimePublisher.js";
import type { Server } from "socket.io";

export class SocketIoPublisher implements IRealtimePublisher {
  constructor(private io: Server) {}

  async publishToUser(
    userId: string,
    event: string,
    payload: unknown,
  ): Promise<void> {
    this.io.to(`user:${userId}`).emit(event, payload);
  }

  async publishToChannel(
    channel: string,
    event: string,
    payload: unknown,
  ): Promise<void> {
    this.io.to(channel).emit(event, payload);
  }
}
