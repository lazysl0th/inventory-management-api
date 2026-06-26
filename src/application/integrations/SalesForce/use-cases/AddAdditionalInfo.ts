import { inject, injectable } from "tsyringe";
import type { ISalesForceService } from "../interfaces/ISalesForceService.js";
import type {
  IAddInfoCompositeResponse,
  IAdditionalData,
} from "../dtos/SalesForceDto.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";

@injectable()
export default class AddAdditionalInfo {
  constructor(
    @inject("UserRepository") private readonly userRepository: IUserRepository,
    @inject("SalesForceService")
    private readonly salesForceService: ISalesForceService,
  ) {}

  async execute(
    userId: string,
    additionalData: IAdditionalData,
  ): Promise<IAddInfoCompositeResponse> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundError("User");
    return await this.salesForceService.createAccountWithContact(
      user,
      additionalData,
    );
  }
}
