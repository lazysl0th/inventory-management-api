export interface IPartIdFormatter {
  readonly formats: readonly string[];
  format(value: unknown, format: string): string;
}
