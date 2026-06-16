import type { Handler } from "express";
import type { Multer } from "multer";

export interface IIntegrationController {
  uploadImageToCloudinary: Handler;
  uploadJsonToDropbox: Handler;
  getLocationFromSalesForce: Handler;
  addAdditionalInfoToSalesForce: Handler;
  getAdditionalInfoFromSalesForce: Handler;
  multerSettingsUpload: Multer;
}
