export interface IAccessInfo {
  access_token: string;
  instance_url: string;
}

interface IPicklistValue {
  value: string;
  label: string;
  active: boolean;
}

interface IField {
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

type TReferenceId = "account" | "contact";

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

export interface ILocations {
  countries: IPicklistValue[] | undefined;
  states: IPicklistValue[] | undefined;
}
