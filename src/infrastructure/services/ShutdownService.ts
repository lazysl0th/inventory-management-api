import { inject, singleton } from "tsyringe";

import type ILogger from "../../application/interfaces/ILogger.js";

//import PrismaService from './PrismaService.js';
import type { ITranslator } from "../../application/interfaces/ITranslator.js";

@singleton()
export default class ShutdownService {
  private isAvailable = true;

  constructor(
    @inject("ITranslator") private i18n: ITranslator,
    @inject("ILogger") private logger: ILogger,
    //@inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}
  public get isAppAvailable(): boolean {
    return this.isAvailable;
  }

  public async stop(): Promise<void> {
    this.isAvailable = false;
    try {
      //this.prismaService.disconnect();
      this.logger.info(this.i18n.t("server.app_stop_safe"));
    } catch (err) {
      this.logger.error({ err }, this.i18n.t("server.app_stop_error"));
      throw err;
    }
  }
}
