export interface IMediaStorageResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: "image" | "video" | "raw" | "auto";
  created_at: string;
  tags: Array<string>;
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  moderation: Array<string>;
  access_control: Array<string>;
  context: object;
  metadata: object;
  colors?: [string, number][];

  [futureKey: string]: unknown;
}

export interface IMediaStorageService {
  uploadImage(file: string): Promise<IMediaStorageResponse>;
}
