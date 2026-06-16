import crypto from "crypto";
import dayjs from "dayjs";
import NotFound from "../errors/NotFound.js";
import type { ISequenceModel } from "../types/models/Sequence.js";
import type { IPartIdGenerator } from "../types/services/PartIdGenerator.js";
import type { Prisma } from "@prisma/client";
import { NOT_FOUND } from "../constants/response.js";

export class TextGenerator implements IPartIdGenerator {
  generate(text: string): string {
    return text;
  }
}

export class SequenceGenerator implements IPartIdGenerator {
  constructor(private readonly SequenceModel: ISequenceModel) {}

  async generate(
    partGuid: string,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    const sequence = await this.SequenceModel.updateOrCreate(partGuid, tx);
    if (!sequence) throw new NotFound(NOT_FOUND.TEXT);
    return sequence.currentValue;
  }
}

export class RandomNumberGenerator implements IPartIdGenerator {
  constructor(private readonly digits: number) {}

  generate(): string {
    const number = crypto.randomInt(0, 10 ** this.digits);
    return number.toString().padStart(this.digits, "0");
  }
}

export class BitRandomNumberGenerator implements IPartIdGenerator {
  constructor(private readonly bit: number) {}

  generate(): bigint {
    const bytes = Math.ceil(this.bit / 8);
    const buffer = crypto.randomBytes(bytes);
    let numBigInt = 0n;
    for (const byte of buffer) numBigInt = (numBigInt << 8n) | BigInt(byte);
    const mask = (1n << BigInt(this.bit)) - 1n;
    return numBigInt & mask;
  }
}

export class DateTimeGenerator implements IPartIdGenerator {
  async generate(): Promise<Date> {
    return dayjs().toDate();
  }
}

export class GuidGenerator implements IPartIdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
