export default interface ILogger {
  error(meta: Record<string, unknown>, message: string): void;
  info(message: string): void;
}
