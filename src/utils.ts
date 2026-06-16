import type { IError } from "./types/base/Error.js";
import type { ICustomIdFormat } from "./types/models/Inventory.js";
import type {
  IAccessTokenData,
  IResetPasswordTokenData,
} from "./types/services/Auth.js";
import type { TClientData } from "./types/services/Ws.js";

export function replaceParamsInTemplate(
  params: Record<string, string>,
  template: string,
): string {
  return Object.entries(params).reduce(
    (result, [params, paramsValue]) =>
      result.replaceAll(`{${params}}`, paramsValue),
    template,
  );
}

export function isCustomIdFormatObject(obj: unknown): obj is ICustomIdFormat {
  if (typeof obj !== "object" || obj === null) return false;
  const { parts, summary } = obj as unknown as ICustomIdFormat;
  return Array.isArray(parts) && typeof summary === "string";
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null;
}

export function isResetPasswordTokenData(
  obj: unknown,
): obj is IResetPasswordTokenData {
  return isObject(obj) && "type" in obj && obj.type === "resetPassword";
}

export function isAccessTokenData(obj: unknown): obj is IAccessTokenData {
  return (
    isObject(obj) &&
    "type" in obj &&
    (obj.type === "access" || obj.type === "refresh")
  );
}

export function isIError(obj: unknown): obj is IError {
  return isObject(obj) && "statusCode" in obj && "message" in obj;
}

export function isClientMessage(data: unknown): data is TClientData {
  return isObject(data) && "type" in data && typeof data.type === "string";
}
