import type { IPartIdFormatter } from "#/application/services/CustomId/interfaces/IPartIdFormatter.js";
import dayjs from "dayjs";

export class DateTimeFormatter implements IPartIdFormatter {
  format(value: Date, format: string): string {
    return dayjs(value).format(format);
  }
}
