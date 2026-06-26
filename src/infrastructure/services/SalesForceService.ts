import type { ISalesForceService } from "#/application/integrations/SalesForce/interfaces/ISalesForceService.js";
import type User from "#/domain/entities/User.js";
import { inject, injectable } from "tsyringe";
import {
  CONFIG_TOKEN,
  type TSalesForceConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type {
  IAccessInfo,
  IAddInfoCompositeResponse,
  IAdditionalData,
  IAddressDescribe,
  IGetInfoResponse,
} from "#/application/integrations/SalesForce/dtos/SalesForceDto.js";
import FetchService from "./FetchService.js";

export type ErrorState = {
  error: string;
};

@injectable()
export default class SalesForceService implements ISalesForceService {
  readonly baseUrl: string;
  readonly options: Record<string, string>;

  constructor(
    @inject(CONFIG_TOKEN) private readonly config: TSalesForceConfig,
    @inject(FetchService) private readonly fetchService: FetchService,
  ) {
    this.baseUrl = this.config.SALES_FORCE_BASE_URL;
    this.options = {
      client_id: this.config.SALES_FORCE_CLIENT_ID,
      client_secret: this.config.SALES_FORCE_CLIENT_SECRET,
    };
  }

  private async getAccessInfo(): Promise<IAccessInfo> {
    return await this.fetchService.post<IAccessInfo>(
      this.baseUrl,
      "/oauth2/token",
      {
        body: new URLSearchParams({
          grant_type: "client_credentials",
          ...this.options,
        }),
      },
    );
  }

  async getAddress(): Promise<IAddressDescribe> {
    const accessInfo = await this.getAccessInfo();
    return await this.fetchService.get<IAddressDescribe>(
      accessInfo.instance_url,
      "/services/data/v64.0/sobjects/Address/describe",
      {
        headers: { Authorization: `Bearer ${accessInfo.access_token}` },
      },
    );
  }

  async createAccountWithContact(
    contactData: User,
    additionalData: IAdditionalData,
  ): Promise<IAddInfoCompositeResponse> {
    const accessInfo = await this.getAccessInfo();
    return await this.fetchService.post<IAddInfoCompositeResponse>(
      accessInfo.instance_url,
      "/services/data/v64.0/composite",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessInfo.access_token}`,
        },
        body: JSON.stringify({
          allOrNone: true,
          compositeRequest: [
            {
              method: "PATCH",
              url: `/services/data/v64.0/sobjects/Account/External_Id_c__c/${contactData.id}`,
              referenceId: "account",
              body: { Name: contactData.name, ...additionalData },
            },
            {
              method: "PATCH",
              url: `/services/data/v64.0/sobjects/Contact/External_Id_c__c/${contactData.id}`,
              referenceId: "contact",
              body: {
                FirstName: contactData.name,
                LastName: contactData.name,
                Email: contactData.email,
                Phone: additionalData.Phone,
                AccountId: "@{account.id}",
              },
            },
          ],
        }),
      },
    );
  }

  async getInfoById(id: string): Promise<IGetInfoResponse> {
    const accessInfo = await this.getAccessInfo();
    return await this.fetchService.get<IGetInfoResponse>(
      accessInfo.instance_url,
      `/services/data/v64.0/query/?q=SELECT Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet FROM Account WHERE External_Id_c__c=${id}`,
      {
        headers: { Authorization: `Bearer ${accessInfo.access_token}` },
      },
    );
  }
}
