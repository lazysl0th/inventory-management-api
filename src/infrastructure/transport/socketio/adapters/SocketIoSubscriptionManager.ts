import type { ISubscriptionManager } from "#/application/realtime/interfaces/ISubscriptionManager.js";
import { Server } from "socket.io";

export class SocketIoSubscriptionManager implements ISubscriptionManager {
  constructor(private io: Server) {}

  async subscribe(userId: string, channel: string): Promise<void> {
    // Находим все сокеты пользователя и добавляем в комнату Socket.IO
    this.io.sockets.sockets.forEach((socket) => {
      if (socket.data.userId === userId) socket.join(channel);
    });
  }

  async unsubscribe(userId: string, channel: string): Promise<void> {
    this.io.sockets.sockets.forEach((socket) => {
      if (socket.data.userId === userId) socket.leave(channel);
    });
  }

  async getSubscribedChannels(): Promise<string[]> {
    return [];
  }
}
