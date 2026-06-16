import type { UploadApiResponse } from "cloudinary";
import type {
  IDropboxApi,
  IUploadResultDropbox,
} from "../types/services/intagrations/Dropbox.js";
import type {
  IIntegrationService,
  ILocations,
  IUploadDataDropbox,
} from "../types/services/Integration.js";
import type CloudinaryApi from "./api/Cloudinary.js";
import type {
  IAdditionalData,
  IAddInfoCompositeResponse,
  ISalesForceApi,
  IGetInfoResponse,
} from "../types/services/intagrations/SalesForce.js";
import NotFound from "../errors/NotFound.js";
import type { IUserService } from "../types/services/User.js";
import { NOT_FOUND } from "../constants/response.js";

export default class IntegrationService implements IIntegrationService {
  constructor(
    private readonly CloudinaryApi: CloudinaryApi,
    private readonly UserService: IUserService,
    private readonly DropboxApi: IDropboxApi,
    private readonly SalesForceApi: ISalesForceApi,
  ) {}

  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    return await this.CloudinaryApi.uploadImage(dataURI);
  }

  async getDropBoxTokens(authCode: string): Promise<unknown> {
    return this.DropboxApi.getDropboxTokens(authCode);
  }

  async uploadJsonToDropbox(
    data: IUploadDataDropbox,
  ): Promise<IUploadResultDropbox> {
    const emailAdmins = await this.UserService.getEmailAdmins();
    const fileName = `support_${new Date().toISOString()}.json`;
    const reportData = {
      reportedBy: { name: data.userName, email: data.userEmail },
      inventory: data.inventory,
      link: data.link,
      priority: data.priority,
      request: data.request,
      createdAt: new Date().toISOString(),
      emailAdmins: emailAdmins.map((email) => email.email),
    };
    return await this.DropboxApi.uploadJsonToDropbox(reportData, fileName);
  }

  async getLocationFromSalesForce(): Promise<ILocations> {
    const resonse = await this.SalesForceApi.getAddress();
    const countries = resonse.fields.find(
      (field) => field.name === "CountryCode",
    );
    const states = resonse.fields.find((field) => field.name === "StateCode");
    return {
      countries: countries?.picklistValues,
      states: states?.picklistValues,
    };
  }

  async addAdditionalInfoToSalesForce(
    userId: number,
    additionalData: IAdditionalData,
  ): Promise<IAddInfoCompositeResponse> {
    const user = await this.UserService.getUserById(userId);
    if (!user) throw new NotFound(NOT_FOUND.TEXT);
    return await this.SalesForceApi.createAccountWithContact(
      user,
      additionalData,
    );
  }

  async getAdditionalInfoFromSalesForce(
    userId: number,
  ): Promise<IGetInfoResponse> {
    return await this.SalesForceApi.getInfoById(userId);
  }
}
