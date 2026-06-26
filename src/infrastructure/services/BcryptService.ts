import bcrypt from "bcryptjs";
import { inject, injectable } from "tsyringe";

import type IHashService from "#/application/services/hash/interfaces/IHashService.js";
import {
  CONFIG_TOKEN,
  type THashServiceConfig,
} from "#/application/configuration/interfaces/IConfig.js";

@injectable()
export default class BcryptService implements IHashService {
  constructor(
    @inject(CONFIG_TOKEN) private readonly config: THashServiceConfig,
  ) {}

  async generate(data: string): Promise<string> {
    return bcrypt.hash(data, this.config.SALT_ROUNDS);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
