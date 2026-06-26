import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import type { TCustomIdPartType } from "#/domain/value-objects/CustomIdFormatPart.js";
import { randomInt } from "node:crypto";
import { injectable } from "tsyringe";

type TDigitsPartType = Extract<TCustomIdPartType, "RANDOM6" | "RANDOM9">;

@injectable()
export class RandomNumberGenerator implements IPartIdGenerator {
  private readonly digits: Record<TDigitsPartType, number>;
  constructor() {
    this.digits = {
      RANDOM6: 6,
      RANDOM9: 9,
    };
  }

  generate(type: TDigitsPartType): number {
    const digits = this.digits[type];
    return randomInt(0, 10 ** digits);
  }
}
