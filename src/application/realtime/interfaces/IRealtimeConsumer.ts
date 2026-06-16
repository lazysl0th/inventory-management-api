export interface IRealtimeConsumer {
  onMessage(
    connectionId: string,
    type: string,
    payload: unknown,
  ): Promise<void>;
}
