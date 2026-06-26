import { inject, injectable } from "tsyringe";
import type { ICloudeStorageService } from "../interfaces/ICloudeStorageService.js";

@injectable()
export default class GetTokens {
  constructor(
    @inject("CloudStorageService")
    private readonly cloudStorageService: ICloudeStorageService,
  ) {}

  async execute(authCode: string): Promise<unknown> {
    return this.cloudStorageService.getTokens(authCode);
  }
}
