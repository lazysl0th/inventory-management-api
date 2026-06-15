import type ILogger from "#/application/interfaces/ILogger.js";

export default class ConsoleLogger implements ILogger {
  error(meta: Record<string, unknown>, message: string): void {
    console.error(message, meta);
  }

  info(message: string): void {
    console.info(message);
  }
}
