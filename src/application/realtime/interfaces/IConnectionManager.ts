export interface IConnectionManager {
  register(connectionId: string, userId: string): Promise<void>;
  unregister(connectionId: string): Promise<void>;
  getUserId(connectionId: string): Promise<string | null>;
}
