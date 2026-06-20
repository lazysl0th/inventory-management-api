export interface ISubscriptionManager {
  subscribe(subscriberId: string, channel: string): Promise<void>;
  unsubscribe(subscriberId: string, channel: string): Promise<void>;
}
