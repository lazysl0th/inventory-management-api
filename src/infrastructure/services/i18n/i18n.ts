import i18next from "i18next";

import { resources } from "./locales/index.js";
import type { ITranslator } from "../../../application/services/translator/interfaces/ITranslator.js";

i18next.init({
  lng: "ru",
  resources,
  fallbackLng: "ru",
  returnObjects: false,
});

export const translator: ITranslator = {
  t: i18next.t,
};
