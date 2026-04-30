import { v2 as cloudinary, type ConfigOptions, type UploadApiResponse } from "cloudinary";
import type { ICloudinaryApi } from "../../types/services/intagrations/Cloudinary.js";
import { CLOUDINARY } from "../../constants/integration.js";


export default class CloudinaryApi implements ICloudinaryApi {
    private readonly cloudinary: typeof cloudinary;
    private readonly options: ConfigOptions;
    
    constructor() {
        this.options = {
            cloud_name: CLOUDINARY.CLOUD_NAME,
            api_key: CLOUDINARY.API_KEY,
            api_secret: CLOUDINARY.API_SECRET,
        };
        cloudinary.config(this.options);
        this.cloudinary = cloudinary;
    }

    async uploadImage(file: string): Promise<UploadApiResponse> {
        return await this.cloudinary.uploader.upload(file, {
            folder: CLOUDINARY.UPLOAD_FOLDER,
        });
    }
}