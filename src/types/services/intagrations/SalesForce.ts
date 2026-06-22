import type { TSafeUser } from "#/application/user/interfaces/IUserRepository.js";

export interface IAccessInfo {
  access_token: string;
  instance_url: string;
}

export interface IPicklistValue {
  value: string;
  label: string;
  active: boolean;
}

export interface IField {
  name: string;
  type: string;
  picklistValues: IPicklistValue[];
}

export interface IAddressDescribe {
  fields: IField[];
}

export interface IAdditionalData {
  Phone: string;
  ShippingCity: string;
  ShippingCountryCode: string;
  ShippingPostalCode: string;
  ShippingStateCode: string;
  ShippingStreet: string;
}

type TReferenceId = "account" | "contact";

interface IBodySuccess {
  id: string;
  success: boolean;
  errors: [];
  created: boolean;
}

interface IBodyError {
  errorCode: string;
  message: string;
}

export interface IResponse {
  body: IBodySuccess | IBodyError;
  httpStatusCode: number;
  referenceId: TReferenceId;
}

export interface IAddInfoCompositeResponse {
  compositeResponse: IResponse[];
}

export interface IGetInfoResponse {
  totalSize: number;
  done: boolean;
  records: IAdditionalData[];
}

export interface ISalesForceApi {
  getAddress(): Promise<IAddressDescribe>;
  createAccountWithContact(
    contactData: TSafeUser,
    additionalData: IAdditionalData,
  ): Promise<IAddInfoCompositeResponse>;
  getInfoById(id: string): Promise<IGetInfoResponse>;
}
