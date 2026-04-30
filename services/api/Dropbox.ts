import IntegrationApi from '../../base/IntegrationApi.js';
import { DROPBOX } from '../../constants/integration.js';
import type { IDropboxApi, IDropboxTokenData, IReportData, IUploadResultDropbox } from '../../types/services/intagrations/Dropbox.js';

export default class DropboxApi extends IntegrationApi implements IDropboxApi {
    readonly baseUrl: string;
    readonly contentUrl: string;
    readonly options: Record<string, string>;
    
    constructor(baseUrl: string, contentUrl: string) {
        super();
        this.baseUrl = baseUrl;
        this.contentUrl = contentUrl;
        this.options = {
            refresh_token: DROPBOX.REFRESH_TOKEN,
            client_id: DROPBOX.CLIENT_ID,
            client_secret: DROPBOX.CLIENT_SECRET,
            redirect_uri: DROPBOX.REDIRECT_URI
        }
    }

    get authorizationSettings() {
        const { refresh_token, ...authorizationSetting} = this.options;
        return authorizationSetting;
    }

    get accessTokenSettings() {
        const { redirect_uri, ...accessTokenSettings } = this.options;
        return accessTokenSettings;
    }

    async getDropboxTokens(authCode: string): Promise<unknown> {
        return await this._post('/oauth2/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: authCode,
                grant_type: 'authorization_code',
                ...this.authorizationSettings,
            })
        });
    }

    private async _getAccessToken(): Promise<IDropboxTokenData> {
        return await this._post<IDropboxTokenData>('/oauth2/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                ...this.accessTokenSettings,
            }),
        })
    }

    async uploadJsonToDropbox(data: IReportData, fileName: string): Promise<IUploadResultDropbox> {
        const tokenData = await this._getAccessToken();
        return this._post('/2/files/upload', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "Dropbox-API-Arg": JSON.stringify({
                    path: `/support/${fileName}`,
                    mode: "add",
                    autorename: true
                }),
                "Content-Type": "application/octet-stream"
            },
            body: Buffer.from(JSON.stringify(data, null, 2))
        }, this.contentUrl)
    }
}