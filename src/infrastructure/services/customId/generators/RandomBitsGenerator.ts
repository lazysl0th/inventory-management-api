import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import type { TCustomIdPartType } from "#/domain/value-objects/CustomIdFormatPart.js";
import { randomBytes } from "node:crypto";
import { injectable } from "tsyringe";

type TBitsPartType = Extract<TCustomIdPartType, "RANDOM20" | "RANDOM32">;

@injectable()
export class RandomBitsGenerator implements IPartIdGenerator {
  private readonly bits: Record<TBitsPartType, number>;
  constructor() {
    this.bits = {
      RANDOM20: 20,
      RANDOM32: 32,
    };
  }

  generate(type: TBitsPartType): bigint {
    const bits = this.bits[type];
    const bytes = Math.ceil(bits / 8);
    const buffer = randomBytes(bytes);
    let numBigInt = 0n;
    for (const byte of buffer) numBigInt = (numBigInt << 8n) | BigInt(byte);
    const mask = (1n << BigInt(bits)) - 1n;
    return numBigInt & mask;
  }
}
