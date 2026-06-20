import type { ISessionRepository } from "#/application/realtime/interfaces/ISessionRepository.js";
import { inject, injectable } from "tsyringe";
import type { IDisconnectUserCommand } from "../../dtos/ConnectionManagementDto.js";

@injectable()
export default class DisconnectUser {
  constructor(
    @inject("ISessionRepository") private sessionRepository: ISessionRepository,
  ) {}

  async execute(command: IDisconnectUserCommand): Promise<void> {
    await this.sessionRepository.delete(command.userId);
  }
}
