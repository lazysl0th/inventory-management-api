import type { IPartIdFormatter } from "#/application/services/CustomId/interfaces/IPartIdFormatter.js";
import type { TCustomIdPartFormat } from "#/domain/value-objects/CustomIdFormatPart.js";
import { injectable } from "tsyringe";

type TDigitFormatsPartType = Extract<
  TCustomIdPartFormat,
  "D1" | "D2" | "D3" | "D4"
>;

@injectable()
export class DigitFormatter implements IPartIdFormatter {
  private readonly formats: Record<TDigitFormatsPartType, number>;
  constructor() {
    this.formats = {
      D1: 1,
      D2: 2,
      D3: 3,
      D4: 4,
    };
  }

  format(value: number, format: TDigitFormatsPartType): string {
    const lengthId = this.formats[format];
    const id = String(value);
    return id.length < lengthId ? id.padStart(lengthId, "0") : id;
  }
}
