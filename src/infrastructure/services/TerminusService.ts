import { /*HealthCheckError,*/ type TerminusOptions } from "@godaddy/terminus";
import { injectable, inject } from "tsyringe";

import {
  CONFIG_TOKEN,
  type TTerminusConfig,
} from "#/application/interfaces/IConfig.js";

//import type { ITranslator } from "#/application/interfaces/ITranslator.js";
import type ILogger from "#/application/interfaces/ILogger.js";
//import ShutdownService from "./ShutdownService.js";

@injectable()
export default class TerminusService {
  constructor(
    @inject(CONFIG_TOKEN) private config: TTerminusConfig,
    @inject("ILogger") private logger: ILogger,
    //@inject('ITranslator') private i18n: ITranslator,
    //@inject(ShutdownService) private readonly shutdownService: ShutdownService,
  ) {}

  public onSignalHandler = async (): Promise<void> => {
    //this.logger.info(this.i18n.t('server.cleanup_start'));
    //try {
    //await this.shutdownService.stop();
    //this.logger.info(this.i18n.t('server.cleanup_success'));
    //} catch (cleanupError) {
    //this.logger.error({ cleanupError }, this.i18n.t('server.cleanup_error'));
    //throw cleanupError;
    //}
  };

  public onShutdownHandler = async (): Promise<void> => {
    //this.logger.info(this.i18n.t('server.process_exited_cleanly'));
  };

  public onHealthCheckHandler = async (): Promise<void> => {
    /*if (!this.shutdownService.isAppAvailable) {
      /*throw new HealthCheckError(this.i18n.t('server.liveness_failed'), {
        message: this.i18n.t('server.liveness_failed'),
        reason: this.i18n.t('server.app_unavailable'),
      });
    }*/
  };

  public options(): TerminusOptions {
    return {
      healthChecks: {
        "/healthz": this.onHealthCheckHandler,
        verbatim: true,
        __unsafeExposeStackTraces: true,
      },
      timeout: this.config.SHUTDOWN_SERVER_TIMEOUT,
      signals: ["SIGINT", "SIGTERM"],
      logger: (msg, err) => this.logger.error({ err }, msg),
      onSignal: this.onSignalHandler,
      onShutdown: this.onShutdownHandler,
    };
  }
}
