import { inject, injectable } from "tsyringe";
import type { ISalesForceService } from "../interfaces/ISalesForceService.js";
import type { ILocations } from "../dtos/SalesForceDto.js";

@injectable()
export default class GetLocation {
  constructor(
    @inject("SalesForceService")
    private readonly salesForceService: ISalesForceService,
  ) {}

  async execute(): Promise<ILocations> {
    const resonse = await this.salesForceService.getAddress();
    const countries = resonse.fields.find(
      (field) => field.name === "CountryCode",
    );
    const states = resonse.fields.find((field) => field.name === "StateCode");
    return {
      countries: countries?.picklistValues,
      states: states?.picklistValues,
    };
  }
}
