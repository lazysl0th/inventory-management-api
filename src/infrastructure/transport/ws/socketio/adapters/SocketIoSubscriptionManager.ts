import { inject, injectable } from "tsyringe";
import SocketIO from "../socketio.js";
import type { ISubscriptionManager } from "#/application/services/realtime/interfaces/ISubscriptionManager.js";

@injectable()
export class SocketIoSubscriptionManager implements ISubscriptionManager {
  constructor(@inject(SocketIO) private socket: SocketIO) {}

  async subscribe(subscriberId: string, channel: string): Promise<void> {
    this.socket.io.to(`${subscriberId}`).socketsJoin(channel);
  }

  async unsubscribe(subscriberId: string, channel: string): Promise<void> {
    this.socket.io.to(`${subscriberId}`).socketsLeave(channel);
  }

  async getSubscribedChannels(): Promise<string[]> {
    return [];
  }
}
