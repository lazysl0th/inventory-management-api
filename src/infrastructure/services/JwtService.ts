import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import type { SignOptions } from "jsonwebtoken";
import {
  CONFIG_TOKEN,
  type TJwtServiceConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import type ITokenService from "#/application/token/interfaces/ITokenService.js";

@injectable()
export default class JwtService implements ITokenService {
  constructor(
    @inject(CONFIG_TOKEN) private readonly config: TJwtServiceConfig,
  ) {}

  generate(payload: object | string, signOptions?: SignOptions): string {
    return jwt.sign(payload, this.config.JWT_SECRET, signOptions);
  }

  verify(token: string): string | object {
    return jwt.verify(token, this.config.JWT_SECRET);
  }
}
