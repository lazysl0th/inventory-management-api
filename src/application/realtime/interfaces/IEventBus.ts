export interface IEvent<T> {
  eventName: string;
  payload: T;
}

export interface IEventBus {
  publish<T>(event: IEvent<T>): Promise<void>;
  subscribe<T>(event: string, handler: (data: T) => Promise<void>): void;
}
