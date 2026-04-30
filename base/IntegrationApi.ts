import { EnumApiMethods, type ErrorState } from "../types/base/IntegrationApi.js";

export default abstract class IntegrationApi {
    abstract readonly baseUrl: string;

    protected async _checkResponse<T>(res: Response): Promise<T> {
        if(res.ok) return res.json();
        const data = (await res.json()) as ErrorState
        return await Promise.reject(data.error || res.statusText)
    }

    protected async _request<T>(url: string = this.baseUrl, uri: string,  options: RequestInit = {}, ) {
        const res = await fetch(url + uri, {
            ...options,
            headers: {
                ...((options.headers as object) ?? {}),
            }
        })
        return this._checkResponse<T>(res);
    }

    protected _get<T>(uri: string, options?: RequestInit, url?: string,): Promise<T> {
        return this._request<T>(url, uri, {...options, method: EnumApiMethods.GET}, )
    }

    protected async _post<T>(uri: string, options?: RequestInit, url?: string): Promise<T> {
        return this._request<T>(url, uri, {...options, method: EnumApiMethods.POST})
    }
}