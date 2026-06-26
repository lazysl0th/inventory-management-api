import { inject, injectable } from "tsyringe";
import type { ISalesForceService } from "../interfaces/ISalesForceService.js";
import type { IGetInfoResponse } from "../dtos/SalesForceDto.js";

@injectable()
export default class GetAdditionalInfo {
  constructor(
    @inject("SalesForceService")
    private readonly salesForceService: ISalesForceService,
  ) {}

  async execute(userId: string): Promise<IGetInfoResponse> {
    return await this.salesForceService.getInfoById(userId);
  }
}
