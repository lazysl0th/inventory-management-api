import type { IPartIdFormatter } from "#/application/services/CustomId/interfaces/IPartIdFormatter.js";
import { injectable } from "tsyringe";

@injectable()
export class HexFormatter implements IPartIdFormatter {
  format(value: number): string {
    return BigInt(value).toString(16);
  }
}
