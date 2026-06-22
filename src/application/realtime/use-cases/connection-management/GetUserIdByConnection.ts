import type { ISessionRepository } from "#/application/realtime/interfaces/ISessionRepository.js";
import { inject, injectable } from "tsyringe";
import type { IGetSessionByUserIdParams } from "../../dtos/ConnectionManagementDto.js";

@injectable()
export class GetSessionByUserId {
  constructor(
    @inject("SessionRepository") private sessionRepository: ISessionRepository,
  ) {}

  async getUserId(params: IGetSessionByUserIdParams): Promise<object | null> {
    return await this.sessionRepository.get(params.userId);
  }
}
