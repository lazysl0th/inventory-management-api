import type { UploadApiResponse } from "cloudinary";

export interface ICloudinaryApi {
  uploadImage(file: string): Promise<UploadApiResponse>;
}
