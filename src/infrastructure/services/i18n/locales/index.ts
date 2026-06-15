import serverEn from "./en/server.json" with { type: "json" };
import errorsEn from "./en/errors.json" with { type: "json" };

export const resources = {
  en: {
    server: serverEn,
    errors: errorsEn,
  },
} as const;
