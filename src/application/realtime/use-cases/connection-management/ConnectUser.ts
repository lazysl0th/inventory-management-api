import type {
  ISession,
  ISessionRepository,
} from "#/application/realtime/interfaces/ISessionRepository.js";
import { inject, injectable } from "tsyringe";
import type { IConnectUserCommand } from "../../dtos/ConnectionManagementDto.js";

@injectable()
export default class ConnectUser {
  constructor(
    @inject("ISessionRepository") private sessionRepository: ISessionRepository,
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
