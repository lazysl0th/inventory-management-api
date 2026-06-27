import { inject, singleton } from "tsyringe";

import type ILogger from "#/application/services/logger/interfaces/ILogger.js";
import type { ITranslator } from "#/application/services/translator/interfaces/ITranslator.js";
import Prisma from "../persistence/prisma/prisma.js";

@singleton()
export default class ShutdownService {
  private isAvailable = true;

  constructor(
    @inject("ITranslator") private i18n: ITranslator,
    @inject("ILogger") private logger: ILogger,
    @inject(Prisma) private readonly prisma: Prisma,
  ) {}
  public get isAppAvailable(): boolean {
    return this.isAvailable;
  }

  public async stop(): Promise<void> {
    this.isAvailable = false;
    try {
      this.prisma.disconnect();
      this.logger.info(this.i18n.t("server.app_stop_safe"));
    } catch (err) {
      this.logger.error({ err }, this.i18n.t("server.app_stop_error"));
      throw err;
    }
  }
}
