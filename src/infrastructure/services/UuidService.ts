import { injectable } from "tsyringe";
import { v7 } from "uuid";

import type IIdService from "#/application/IdService/interfaces/IIdService.js";

@injectable()
export default class UuidService implements IIdService {
  constructor() {}

  generate(): string {
    return v7();
  }
}
