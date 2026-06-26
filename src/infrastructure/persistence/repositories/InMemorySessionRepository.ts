import type {
  ISession,
  ISessionRepository,
  TSessionValue,
} from "#/application/services/realtime/interfaces/ISessionRepository.js";
import { singleton } from "tsyringe";

@singleton()
export class InMemorySessionRepository implements ISessionRepository {
  private readonly storage = new Map<string, TSessionValue>();
  private readonly SESSION_PREFIX = "session:";

  getSessionKey(sessionId: string) {
    return `${this.SESSION_PREFIX}${sessionId}`;
  }

  async save(session: ISession): Promise<void> {
    this.storage.set(this.getSessionKey(session.id), {
      userId: session.userId,
      isAuthenticated: session.isAuthenticated,
      connectedAt: session.connectedAt,
      ttlSeconds: session.ttlSeconds,
      channels: session.channels,
    });
  }

  async get(sessionId: string): Promise<TSessionValue | null> {
    return this.storage.get(this.getSessionKey(sessionId)) || null;
  }

  async delete(sessionId: string): Promise<void> {
    this.storage.delete(this.getSessionKey(sessionId));
  }

  async exists(sessionId: string): Promise<boolean> {
    return this.storage.has(this.getSessionKey(sessionId));
  }

  async addChannel(sessionId: string, channel: string): Promise<void> {
    const session = await this.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    session.channels.add(channel);
  }

  async removeChannel(sessionId: string, channel: string): Promise<void> {
    const session = await this.get(sessionId);
    if (!session) {
      return;
    }
    session.channels.delete(channel);
  }

  async getActiveChannels(sessionId: string): Promise<string[]> {
    const session = await this.get(sessionId);
    if (!session) return [];
    return [...session.channels];
  }
}
