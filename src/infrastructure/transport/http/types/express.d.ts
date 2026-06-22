import type { TAuthTokens } from "#/application/auth/dtos/AuthDto.ts";
import type DomainUser from "#/domain/entities/User.ts";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends DomainUser {}

    interface AuthInfo {
      authTokens: TAuthTokens;
    }
  }
}
