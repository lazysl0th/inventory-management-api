import type { RequestHandler } from "express";
import BadRequestError from "#/domain/errors/BadRequestError.js";
import { inject, injectable } from "tsyringe";
import HttpStatusCode from "../../../constants/httpStatusCode.js";
import UploadJson from "#/application/integrations/CloudStorage/use-cases/UploadJson.js";
import GetTokens from "#/application/integrations/CloudStorage/use-cases/GetTokens.js";
import type {
  IAuthCodeDropbox,
  IUploadDataDropbox,
  IUploadResultDropbox,
} from "#/application/integrations/CloudStorage/dtos/CloudStorageDto.js";

@injectable()
export default class DropboxController {
  constructor(
    @inject(UploadJson) private readonly uploadJsonToDropbox: UploadJson,
    @inject(GetTokens) private readonly exchangeDropboxCodeOnToken: GetTokens,
  ) {}

  uploadJson: RequestHandler<never, IUploadResultDropbox, IUploadDataDropbox> =
    async (req, res) => {
      const uploadData = req.body;
      const result = await this.uploadJsonToDropbox.execute(uploadData);
      res.status(HttpStatusCode.Ok).json(result);
    };

  exchangeCodeOnToken: RequestHandler<never, unknown, never, IAuthCodeDropbox> =
    async (req, res) => {
      if (!req.query.code) throw new BadRequestError();
      const authCode = req.query.code;
      const result = await this.exchangeDropboxCodeOnToken.execute(authCode);
      res.status(HttpStatusCode.Ok).json(result);
    };
}
