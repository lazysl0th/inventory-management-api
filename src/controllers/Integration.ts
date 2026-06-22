import type { UploadApiResponse } from "cloudinary";
import multer, { type Multer } from "multer";
import { Controller } from "../base/Controller.js";
import type { IIntegrationController } from "../types/controllers/Integration.js";
import type { Handler } from "express";
import type { IUploadResultDropbox } from "../types/services/intagrations/Dropbox.js";
import type {
  IAuthCodeDropbox,
  IIntegrationService,
  ILocations,
  IUploadDataDropbox,
} from "../types/services/Integration.js";
import type {
  IAddInfoCompositeResponse,
  IAdditionalData,
  IGetInfoResponse,
} from "../types/services/intagrations/SalesForce.js";
import type { IParamUserId } from "../types/controllers/User.js";
import { BAD_REQUEST, INSUFFICIENT_PERMISSION } from "../constants/response.js";
import { MULTER_OPTIONS } from "../constants/multer.js";
import BadRequest from "#/domain/errors/BadRequest.js";
import Forbidden from "#/domain/errors/Forbidden.js";

export default class IntegrationController
  extends Controller
  implements IIntegrationController
{
  constructor(private readonly IntegrationService: IIntegrationService) {
    super();
  }

  multerSettingsUpload: Multer = multer(MULTER_OPTIONS);

  uploadImageToCloudinary: Handler = this.handle(async (req, res) => {
    if (!req.file) throw new BadRequest(BAD_REQUEST.TEXT);
    const result = await this.IntegrationService.uploadImageToCloudinary(
      req.file,
    );
    this.ok<UploadApiResponse>(res, result);
  });

  uploadJsonToDropbox: Handler = this.handle<object, IUploadDataDropbox>(
    async (req, res) => {
      const uploadData = req.body;
      const result =
        await this.IntegrationService.uploadJsonToDropbox(uploadData);
      this.ok<IUploadResultDropbox>(res, result);
    },
  );

  exchangeDropBoxCodeOnToken: Handler = this.handle<
    object,
    object,
    IAuthCodeDropbox
  >(async (req, res) => {
    if (!req.query.code) throw new BadRequest(BAD_REQUEST.TEXT);
    const authCode = req.query.code;
    const result = await this.IntegrationService.getDropBoxTokens(authCode);
    this.ok<unknown>(res, result);
  });

  getLocationFromSalesForce: Handler = this.handle(async (_, res) => {
    const location = await this.IntegrationService.getLocationFromSalesForce();
    this.ok<ILocations>(res, location);
  });

  addAdditionalInfoToSalesForce: Handler = this.handle<
    IParamUserId,
    IAdditionalData
  >(async (req, res) => {
    const userId = req.params.userId;
    const additionalData = req.body;
    const currentUser = req.user;
    if (
      currentUser.id !== userId //&&
      //!Passport.checkUserRoles(currentUser, ["Admin"])
    )
      throw new Forbidden(INSUFFICIENT_PERMISSION.TEXT);
    const result = await this.IntegrationService.addAdditionalInfoToSalesForce(
      userId,
      additionalData,
    );
    this.ok<IAddInfoCompositeResponse>(res, result);
  });

  getAdditionalInfoFromSalesForce: Handler = this.handle<IParamUserId>(
    async (req, res) => {
      const userId = req.params.userId;
      const additionalInfo =
        await this.IntegrationService.getAdditionalInfoFromSalesForce(userId);
      this.ok<IGetInfoResponse>(res, additionalInfo);
    },
  );
}
