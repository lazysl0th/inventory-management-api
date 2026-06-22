import type { TSafeUser } from "#/application/user/dtos/IUserRepository.js";
import IntegrationApi from "../../base/IntegrationApi.js";
import { SALES_FORCE } from "../../constants/integration.js";
import type {
  IAccessInfo,
  IAddressDescribe,
  ISalesForceApi,
  IAdditionalData,
  IAddInfoCompositeResponse,
  IGetInfoResponse,
} from "../../types/services/intagrations/SalesForce.js";

export default class SalesForceApi
  extends IntegrationApi
  implements ISalesForceApi
{
  readonly baseUrl: string;
  readonly options: Record<string, string>;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
    this.options = {
      client_id: SALES_FORCE.CLIENT_ID,
      client_secret: SALES_FORCE.CLIENT_SECRET,
    };
  }

  private async _getAccessInfo(): Promise<IAccessInfo> {
    return await this._post<IAccessInfo>("/oauth2/token", {
      body: new URLSearchParams({
        grant_type: "client_credentials",
        ...this.options,
      }),
    });
  }

  async getAddress(): Promise<IAddressDescribe> {
    const accessInfo = await this._getAccessInfo();
    return await this._get<IAddressDescribe>(
      "/services/data/v64.0/sobjects/Address/describe",
      {
        headers: { Authorization: `Bearer ${accessInfo.access_token}` },
      },
      accessInfo.instance_url,
    );
  }

  async createAccountWithContact(
    contactData: TSafeUser,
    additionalData: IAdditionalData,
  ): Promise<IAddInfoCompositeResponse> {
    const accessInfo = await this._getAccessInfo();
    return await this._post<IAddInfoCompositeResponse>(
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
      accessInfo.instance_url,
    );
  }

  async getInfoById(id: number | string): Promise<IGetInfoResponse> {
    const accessInfo = await this._getAccessInfo();
    return await this._get<IGetInfoResponse>(
      `/services/data/v64.0/query/?q=SELECT Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet FROM Account WHERE External_Id_c__c=${id}`,
      {
        headers: { Authorization: `Bearer ${accessInfo.access_token}` },
      },
      accessInfo.instance_url,
    );
  }
}
