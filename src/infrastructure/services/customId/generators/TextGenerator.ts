import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import { injectable } from "tsyringe";

@injectable()
export class TextGenerator implements IPartIdGenerator {
  generate(text: string): string {
    return text;
  }
}
