import type { Role } from "#/infrastructure/persistence/prisma/generated/client.js";
import type { TSafeUserWithRoles } from "../models/User.js";
import type { gmail_v1 } from "googleapis";

export interface IUserData {
  name: string;
  email: string;
}

export type TProvider = "googleId" | "facebookId";

export interface IRegData extends IUserData {
  password: string;
}

export interface TEmailAuthData extends Omit<IRegData, "name"> {
  remember: boolean;
}

export interface ISocialAuthData extends IUserData {
  provider: TProvider;
  socialId: string;
}

export type TRole = {
  role: Role;
};

type TToken = "access" | "refresh" | "resetPassword";

interface ITokenData {
  userId: number;
  type: TToken;
}

export interface IAccessTokenData extends ITokenData {
  type: "access" | "refresh";
  userRoles: TRole[];
}

export interface IResetPasswordTokenData extends ITokenData {
  type: "resetPassword";
}

export type TResetUserPasswordData = Omit<IUserData, "name">;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResultData {
  user: TSafeUserWithRoles;
  authTokens: IAuthTokens;
}

export type TVerifyResultData = Omit<IAuthResultData, "authTokens">;

export interface IAuthService {
  registerUser(regData: IRegData | ISocialAuthData): Promise<IAuthResultData>;
  loginUserByEmail(authData: TEmailAuthData): Promise<IAuthResultData | null>;
  loginUserBySocials(authData: ISocialAuthData): Promise<IAuthResultData>;
  logoutUser(refreshToken: string): Promise<TSafeUserWithRoles>;
  resetUserPassword(email: string): Promise<null | gmail_v1.Schema$Message>;
  changeUserPassword(
    token: string,
    password: string,
  ): Promise<TSafeUserWithRoles>;
  createToken(
    tokenData: IAccessTokenData | IResetPasswordTokenData,
    remember?: boolean,
  ): string;
  refreshAccessToken(refreshToken: string): Promise<string>;
}
