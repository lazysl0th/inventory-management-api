import type { TAuthTokens } from "#/application/auth/dtos/AuthDto.js";
import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";
import type { Strategy } from "passport";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import type { IVerifyOptions } from "passport-local";

export interface IStrategy<S extends Strategy> {
  readonly strategy: S;
}

export interface IVerifyOptionsExtends extends IVerifyOptions {
  authTokens?: TAuthTokens | undefined;
}

export type TAuthResult = {
  user: TSafeUserWithRoles;
  info: IVerifyOptionsExtends;
};

export type DoneCallbackWithOptions = (
  error: unknown,
  user?: Express.User | false,
  options?: IVerifyOptionsExtends,
) => void;

export type VerifyUserHandler<TUser> = () => Promise<TUser | null>;

export type VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => void;
