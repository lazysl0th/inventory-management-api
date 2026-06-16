export interface IEventBus {
  publish<T>(event: string, data: T): Promise<void>;
  subscribe<T>(event: string, handler: (data: T) => Promise<void>): void;
}
