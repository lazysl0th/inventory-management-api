import { inject, injectable } from "tsyringe";
import type { IDisconnectUserCommand } from "../../dtos/ConnectionManagementDto.js";
import type { ISessionRepository } from "../../interfaces/ISessionRepository.js";

@injectable()
export default class DisconnectUser {
  constructor(
    @inject("SessionRepository") private sessionRepository: ISessionRepository,
  ) {}

  async execute(command: IDisconnectUserCommand): Promise<void> {
    await this.sessionRepository.delete(command.userId);
  }
}
