import type { RequestHandler } from "express";
import BadRequestError from "#/domain/errors/BadRequestError.js";
import { inject, injectable } from "tsyringe";
import type { IMediaStorageResponse } from "#/application/integrations/MediaStorage/interfaces/IMediaStorageService.js";
import HttpStatusCode from "../../../constants/httpStatusCode.js";
import UploadImage from "#/application/integrations/MediaStorage/use-cases/UploadImage.js";

@injectable()
export default class CloudinaryController {
  constructor(@inject(UploadImage) private readonly uploadImage: UploadImage) {}
  uploadImageToCloudinary: RequestHandler<never, IMediaStorageResponse> =
    async (req, res) => {
      if (!req.file) throw new BadRequestError();
      const result = await this.uploadImage.execute(req.file);
      res.status(HttpStatusCode.Ok).json(result);
    };
}
