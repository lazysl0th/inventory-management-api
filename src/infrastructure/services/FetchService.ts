import { injectable } from "tsyringe";

export type ErrorState = {
  error: string;
};

@injectable()
export default class FetchService {
  private async checkResponse<T>(res: Response): Promise<T> {
    if (res.ok) return res.json();
    const data = (await res.json()) as ErrorState;
    return await Promise.reject(data.error || res.statusText);
  }

  private async request<T>(
    url: string,
    uri: string,
    options: RequestInit = {},
  ) {
    const res = await fetch(url + uri, {
      ...options,
      headers: {
        ...((options.headers as object) ?? {}),
      },
    });
    return this.checkResponse<T>(res);
  }

  async get<T>(url: string, uri: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, uri, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(url: string, uri: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, uri, {
      ...options,
      method: "POST",
    });
  }
}
