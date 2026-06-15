import "i18next";

import type { resources } from "./locales/index.js";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"];
  }
}
