import {
  v2 as cloudinary,
  type ConfigOptions,
  type UploadApiResponse,
} from "cloudinary";
import type { IMediaStorageService } from "#/application/integrations/MediaStorage/interfaces/IMediaStorageService.js";
import {
  CONFIG_TOKEN,
  type TCloudinaryConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import { inject, injectable } from "tsyringe";

@injectable()
export default class CloudinaryService implements IMediaStorageService {
  private readonly cloudinary: typeof cloudinary;
  private readonly options: ConfigOptions;

  constructor(
    @inject(CONFIG_TOKEN) private readonly config: TCloudinaryConfig,
  ) {
    this.options = {
      cloud_name: this.config.CLOUDINARY_CLOUD_NAME,
      api_key: this.config.CLOUDINARY_API_KEY,
      api_secret: this.config.CLOUDINARY_API_SECRET,
    };
    cloudinary.config(this.options);
    this.cloudinary = cloudinary;
  }

  async uploadImage(file: string): Promise<UploadApiResponse> {
    return await this.cloudinary.uploader.upload(file, {
      folder: this.config.CLOUDINARY_UPLOAD_FOLDER,
    });
  }
}
