import { inject, injectable } from "tsyringe";
import type { ICloudeStorageService } from "#/application/integrations/CloudStorage/interfaces/ICloudeStorageService.js";
import FetchService from "./FetchService.js";
import {
  CONFIG_TOKEN,
  type TDropboxConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type {
  IDropboxTokenData,
  IReportData,
  IUploadResultDropbox,
} from "#/application/integrations/CloudStorage/dtos/CloudStorageDto.js";

@injectable()
export default class DropboxService implements ICloudeStorageService {
  readonly baseUrl: string;
  readonly contentUrl: string;
  readonly options: Record<string, string>;

  constructor(
    @inject(CONFIG_TOKEN) private readonly config: TDropboxConfig,
    @inject(FetchService) private readonly fetchService: FetchService,
  ) {
    this.baseUrl = this.config.DROPBOX_BASE_URL;
    this.contentUrl = this.config.DROPBOX_CONTENT_URL;
    this.options = {
      refresh_token: this.config.DROPBOX_REFRESH_TOKEN,
      client_id: this.config.DROPBOX_CLIENT_ID,
      client_secret: this.config.DROPBOX_CLIENT_SECRET,
      redirect_uri: this.config.DROPBOX_REDIRECT_URI,
    };
  }

  private get authorizationSettings() {
    const { refresh_token, ...authorizationSetting } = this.options;
    void refresh_token;
    return authorizationSetting;
  }

  private get accessTokenSettings() {
    const { redirect_uri, ...accessTokenSettings } = this.options;
    void redirect_uri;
    return accessTokenSettings;
  }

  async getTokens(authCode: string): Promise<unknown> {
    return await this.fetchService.post(this.baseUrl, "/oauth2/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authCode,
        grant_type: "authorization_code",
        ...this.authorizationSettings,
      }),
    });
  }

  private async getAccessToken(): Promise<IDropboxTokenData> {
    return await this.fetchService.post<IDropboxTokenData>(
      this.baseUrl,
      "/oauth2/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          ...this.accessTokenSettings,
        }),
      },
    );
  }

  async uploadJson(
    data: IReportData,
    fileName: string,
  ): Promise<IUploadResultDropbox> {
    const tokenData = await this.getAccessToken();
    return this.fetchService.post(this.contentUrl, "/2/files/upload", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: `/support/${fileName}`,
          mode: "add",
          autorename: true,
        }),
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(JSON.stringify(data, null, 2)),
    });
  }
}
