import dayjs from "dayjs";
import type { IPartIdFormatter } from "../types/services/PartIdFormatter.js";

export class DateTimeFormatter implements IPartIdFormatter {
  readonly formats = [
    "YYYY",
    "YYYYMM",
    "YYYYMMDD",
    "YYYYMMDD-HHmm",
    "YYYYMMDD-HHmmss",
  ];

  format(value: unknown, format: string): string {
    return dayjs(value as Date).format(format);
  }
}

export class DigitFormatter implements IPartIdFormatter {
  readonly formats = ["D1", "D2", "D3", "D4"];

  format(value: unknown, format: string): string {
    const len = parseInt(format.slice(1), 10);
    const idStr = String(value);
    return idStr.length < len ? idStr.padStart(len, "0") : idStr;
  }
}

export class HexFormatter implements IPartIdFormatter {
  readonly formats = ["X5", "X8"];

  format(value: unknown): string {
    return BigInt(value as number).toString(16);
  }
}
