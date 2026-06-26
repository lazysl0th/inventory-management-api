export interface IRealtimePublisher<T> {
  publishToUser(userId: string, event: string, payload: T): Promise<void>;
  publishToChannel(channel: string, event: string, payload: T): Promise<void>;
  broadcast<T>(eventName: string, payload: T): Promise<void>;
}
