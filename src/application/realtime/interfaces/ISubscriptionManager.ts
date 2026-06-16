export interface ISubscriptionManager {
  subscribe(userId: string, channel: string): Promise<void>;
  unsubscribe(userId: string, channel: string): Promise<void>;
  getSubscribedChannels(userId: string): Promise<string[]>;
}
