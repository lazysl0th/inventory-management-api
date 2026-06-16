export interface IRealtimePublisher {
  publishToUser(userId: string, event: string, payload: unknown): Promise<void>;
  publishToChannel(
    channel: string,
    event: string,
    payload: unknown,
  ): Promise<void>;
}
