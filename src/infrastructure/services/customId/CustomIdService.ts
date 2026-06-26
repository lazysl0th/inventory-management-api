import type { ICustomIdService } from "#/application/services/CustomId/interfaces/ICustomIdService.js";
import type { IPartIdFormatter } from "#/application/services/CustomId/interfaces/IPartIdFormatter.js";
import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import NotFoundError from "#/domain/errors/NotFoundError.js";
import type { TCustomIdPartType } from "#/domain/value-objects/CustomIdFormatPart.js";
import type CustomIdFormatPart from "#/domain/value-objects/CustomIdFormatPart.js";
import { inject, injectable } from "tsyringe";

@injectable()
export class CustomIdService implements ICustomIdService {
  private readonly generators: Partial<
    Record<TCustomIdPartType, IPartIdGenerator>
  >;
  private readonly formatters: Partial<Record<string, IPartIdFormatter>>;
  constructor(
    @inject("TextGenerator") text: IPartIdGenerator,
    @inject("RandomNumberGenerator") randomNumber: IPartIdGenerator,
    @inject("RandomBitsGenerator") randomBits: IPartIdGenerator,
    @inject("UuidGenerator") randomUUID: IPartIdGenerator,
    @inject("SequenceGenerator") sequence: IPartIdGenerator,
    @inject("DateTimeGenerator") dateTimeGenerator: IPartIdGenerator,
    @inject("DateTimeFormatter") dateTimeFormatter: IPartIdFormatter,
    @inject("DigitFormatter") digitFormatter: IPartIdFormatter,
    @inject("HexFormatter") hexFormatter: IPartIdFormatter,
  ) {
    this.generators = {
      TEXT: text,
      RANDOM6: randomNumber,
      RANDOM9: randomNumber,
      RANDOM20: randomBits,
      RANDOM32: randomBits,
      GUID: randomUUID,
      SEQUENCE: sequence,
      DATETIME: dateTimeGenerator,
    };
    this.formatters = {
      YYYY: dateTimeFormatter,
      YYYYMM: dateTimeFormatter,
      YYYYMMDD: dateTimeFormatter,
      "YYYYMMDD-HHmm": dateTimeFormatter,
      "YYYYMMDD-HHmmss": dateTimeFormatter,
      D1: digitFormatter,
      D2: digitFormatter,
      D3: digitFormatter,
      D4: digitFormatter,
      D6: dateTimeFormatter,
      D10: dateTimeFormatter,
      X5: hexFormatter,
      X8: hexFormatter,
    };
  }

  async generate(customIdParts: CustomIdFormatPart[]): Promise<string> {
    const generatedParts = customIdParts.map(async (part) => {
      const generator = this.generators[part.type];
      if (!generator) throw new NotFoundError("CustomIdGenerator");
      const idParams =
        part.type === "SEQUENCE"
          ? part.id
          : part.type === "TEXT"
            ? (part.format ?? "")
            : part.type;
      const id = generator.generate(idParams);
      if (part.format && part.type !== "TEXT") {
        const formatter = this.formatters[part.format];
        if (!formatter) throw new NotFoundError("CustomIdGenerator");
        return formatter.format(id, part.format);
      }
      return id;
    });
    return generatedParts.join("");
  }
}
