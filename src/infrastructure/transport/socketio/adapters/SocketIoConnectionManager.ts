import type { IConnectionManager } from "#/application/realtime/interfaces/IConnectionManager.js";
import { Server } from "socket.io";

export class SocketIoConnectionManager implements IConnectionManager {
  constructor(private io: Server) {}

  async register(connectionId: string, userId: string): Promise<void> {
    const socket = this.io.sockets.sockets.get(connectionId);
    if (socket) socket.data.userId = userId; // Внедряем данные в контекст Socket.IO
  }

  async unregister(connectionId: string): Promise<void> {
    const socket = this.io.sockets.sockets.get(connectionId);
    if (socket) socket.data.userId = undefined;
  }

  async getUserId(connectionId: string): Promise<string | null> {
    return this.io.sockets.sockets.get(connectionId)?.data.userId || null;
  }
}
