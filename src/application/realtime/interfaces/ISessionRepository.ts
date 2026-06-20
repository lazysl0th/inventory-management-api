export interface ISession {
  readonly id: string;
  readonly userId: string;
  readonly isAuthenticated: boolean;
  readonly connectedAt: Date;
  readonly ttlSeconds: number | undefined;
  readonly channels: Set<string>;
}

export type TSessionValue = Omit<ISession, "id">;

export interface ISessionRepository {
  save(session: ISession): Promise<void>;
  get(sessionId: string): Promise<TSessionValue | null>;
  delete(sessionId: string): Promise<void>;
  exists(sessionId: string): Promise<boolean>;
  addChannel(sessionId: string, channel: string): Promise<void>;
  removeChannel(sessionId: string, channel: string): Promise<void>;
  getActiveChannels(sessionId: string): Promise<string[]>;
}
