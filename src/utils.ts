import type CustomIdFormat from "./domain/value-objects/CustomIdFormat.js";
import type { IError } from "./types/base/Error.js";

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

export function isCustomIdFormatObject(obj: unknown): obj is CustomIdFormat {
  if (typeof obj !== "object" || obj === null) return false;
  const { parts, summary } = obj as unknown as CustomIdFormat;
  return Array.isArray(parts) && typeof summary === "string";
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null;
}

export function isIError(obj: unknown): obj is IError {
  return isObject(obj) && "statusCode" in obj && "message" in obj;
}
