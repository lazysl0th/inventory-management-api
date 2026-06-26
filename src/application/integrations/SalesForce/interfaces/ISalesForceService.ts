import type User from "#/domain/entities/User.js";
import type {
  IAddInfoCompositeResponse,
  IAdditionalData,
  IAddressDescribe,
  IGetInfoResponse,
} from "../dtos/SalesForceDto.js";

export interface ISalesForceService {
  getAddress(): Promise<IAddressDescribe>;
  createAccountWithContact(
    contactData: User,
    additionalData: IAdditionalData,
  ): Promise<IAddInfoCompositeResponse>;
  getInfoById(id: string): Promise<IGetInfoResponse>;
}
