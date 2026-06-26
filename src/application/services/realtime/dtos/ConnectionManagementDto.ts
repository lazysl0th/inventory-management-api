export interface IConnectUserCommand {
  userId: string;
  connectionId: string;
  isAuthenticated: boolean;
}

export interface IDisconnectUserCommand {
  userId: string;
}

export interface IGetSessionByUserIdParams {
  userId: string;
}
