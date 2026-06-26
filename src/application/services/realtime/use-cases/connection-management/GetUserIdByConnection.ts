import { inject, injectable } from "tsyringe";
import type { IGetSessionByUserIdParams } from "../../dtos/ConnectionManagementDto.js";
import type { ISessionRepository } from "../../interfaces/ISessionRepository.js";

@injectable()
export class GetSessionByUserId {
  constructor(
    @inject("SessionRepository") private sessionRepository: ISessionRepository,
  ) {}

  async getUserId(params: IGetSessionByUserIdParams): Promise<object | null> {
    return await this.sessionRepository.get(params.userId);
  }
}
