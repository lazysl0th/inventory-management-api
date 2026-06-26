import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import { randomUUID } from "node:crypto";
import { injectable } from "tsyringe";

@injectable()
export class UuidGenerator implements IPartIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
