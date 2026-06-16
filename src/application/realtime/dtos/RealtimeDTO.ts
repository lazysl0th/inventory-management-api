export interface ISubscribeToChannelCommand {
  userId: string;
  channel: string;
}

export interface IUnsubscribeFromChannelCommand {
  userId: string;
  channel: string;
}

export interface IGetUserSubscriptionsQuery {
  userId: string;
}

export interface IChannelSubscribedEvent {
  userId: string;
  channel: string;
  timestamp: Date;
}
