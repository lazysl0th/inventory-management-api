import type {
  IReportData,
  IUploadResultDropbox,
} from "../dtos/CloudStorageDto.js";

export interface ICloudeStorageService {
  getTokens(authCode: string): Promise<unknown>;
  uploadJson(
    data: IReportData,
    fileName: string,
  ): Promise<IUploadResultDropbox>;
}
