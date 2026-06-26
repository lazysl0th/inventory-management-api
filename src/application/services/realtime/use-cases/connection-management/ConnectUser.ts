import { inject, injectable } from "tsyringe";
import type { IConnectUserCommand } from "../../dtos/ConnectionManagementDto.js";
import type {
  ISession,
  ISessionRepository,
} from "../../interfaces/ISessionRepository.js";

@injectable()
export default class ConnectUser {
  constructor(
    @inject("SessionRepository") private sessionRepository: ISessionRepository,
  ) {}

  async execute(command: IConnectUserCommand): Promise<void> {
    const session: ISession = {
      id: command.connectionId,
      userId: command.userId,
      isAuthenticated: command.isAuthenticated,
      connectedAt: new Date(),
      ttlSeconds: undefined,
      channels: new Set(),
    };

    await this.sessionRepository.save(session);
    console.log(
      `[Socket.IO] [ConnectUser] Client connected: ${command.connectionId}`,
    );
    console.log(
      `[Socket.IO] [ConnectUser] User ID from handshake: ${command.userId}`,
    );
  }
}
