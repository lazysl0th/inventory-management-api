export interface INotifier {
  notify(channel: string, payload: unknown): void;
}
