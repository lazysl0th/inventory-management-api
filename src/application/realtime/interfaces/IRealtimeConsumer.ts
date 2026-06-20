export interface IRealtimeConsumer<T> {
  onMessage(connectionId: string, type: string, payload: T): Promise<void>;
}
