import type { UploadApiResponse } from "cloudinary";
import type { IUploadResultDropbox } from "./intagrations/Dropbox.js";
import type { IAdditionalData, IAddInfoCompositeResponse, IPicklistValue, IGetInfoResponse } from "./intagrations/SalesForce.js";

export interface IUploadDataDropbox {
    userName: string;
    userEmail: string;
    inventory: string;
    link: string;
    priority: string;
    request: string;
}

export interface IAuthCodeDropbox {
    code: string;
}

export interface ILocations {
    countries: IPicklistValue[] | undefined;
    states: IPicklistValue[] | undefined;
}

export interface IIntegrationService {
    uploadJsonToDropbox(data: IUploadDataDropbox): Promise<IUploadResultDropbox>;
    getDropBoxTokens (authCode: string): Promise<unknown>;
    uploadImageToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse>;
    getLocationFromSalesForce(): Promise<ILocations>
    addAdditionalInfoToSalesForce(userId: number, additionalData: IAdditionalData): Promise<IAddInfoCompositeResponse>;
    getAdditionalInfoFromSalesForce(userId: number): Promise<IGetInfoResponse>;
}