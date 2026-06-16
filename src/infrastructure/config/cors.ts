import type { CorsOptions } from "cors";

import { injectable, inject } from "tsyringe";

import {
  CONFIG_TOKEN,
  type TCorsConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import ForbiddenError from "#/domain/errors/ForbiddenError.js";

@injectable()
export default class CorsConfig {
  constructor(@inject(CONFIG_TOKEN) private config: TCorsConfig) {}

  private customOrigin: CorsOptions["origin"] = (origin, callback) => {
    if (!origin || this.config.FRONTEND_URL.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new ForbiddenError());
  };

  public get options(): CorsOptions {
    return {
      origin: this.customOrigin,
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    };
  }
}
