export interface IDropboxTokenData {
  access_token: string;
  token_type: string;
  expires_in: 14400;
}

export interface IReportData {
  createdAt: string;
  emailAdmins: string[];
  inventory: string;
  link: string;
  priority: string;
  request: string;
  reportedBy: {
    name: string;
    email: string;
  };
}

export interface IUploadResultDropbox {
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
  client_modified: string;
  server_modified: string;
  rev: string;
  size: number;
  is_downloadable: boolean;
  content_hash: string;
}

export interface IDropboxApi {
  getDropboxTokens(authCode: string): Promise<unknown>;
  uploadJsonToDropbox(
    data: IReportData,
    fileName: string,
  ): Promise<IUploadResultDropbox>;
}
