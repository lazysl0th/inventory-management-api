import { inject, injectable } from "tsyringe";
import type {
  IMediaStorageResponse,
  IMediaStorageService,
} from "../interfaces/IMediaStorageService.js";

@injectable()
export default class UploadImage {
  constructor(
    @inject("MediaStorageService")
    private readonly mediaStorageService: IMediaStorageService,
  ) {}

  async execute(file: Express.Multer.File): Promise<IMediaStorageResponse> {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    return await this.mediaStorageService.uploadImage(dataURI);
  }
}
