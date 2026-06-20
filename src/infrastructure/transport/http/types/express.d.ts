import type { TRequestUser } from "#/application/user/dtos/UserDto.ts";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends TRequestUser {}
  }
}
