import type { IPartIdGenerator } from "#/application/services/CustomId/interfaces/IPartIdGenerator.js";
import dayjs from "dayjs";
import { injectable } from "tsyringe";

@injectable()
export class DateTimeGenerator implements IPartIdGenerator {
  generate(): Date {
    return dayjs().toDate();
  }
}
