import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { TSafeUserWithRoles } from "../types/models/User.js";
import type {
  IAuthService,
  IAccessTokenData,
  TEmailAuthData,
  ISocialAuthData,
  IRegData,
  IResetPasswordTokenData,
  IAuthResultData,
  IAuthTokens,
} from "../types/services/Auth.js";
import type { IEmailService } from "../types/services/Email.js";
import BadRequest from "../errors/BadRequest.js";
import ResetPasswordUserMessage from "./messages/ResetPasswordUser.js";
import type { gmail_v1 } from "googleapis";
import type { IUserService } from "../types/services/User.js";
import { isAccessTokenData, isResetPasswordTokenData } from "../utils.js";
import Forbidden from "../errors/Forbidden.js";
import { CRYPTO } from "../constants/crypto.js";
import { BAD_REQUEST, FORBIDDEN } from "../constants/response.js";

export default class AuthService implements IAuthService {
  constructor(
    private readonly UserService: IUserService,
    private readonly EmailService: IEmailService,
  ) {}

  async registerUser(
    regData: IRegData | ISocialAuthData,
  ): Promise<IAuthResultData> {
    const hash =
      "provider" in regData
        ? null
        : await bcrypt.hash(regData.password, CRYPTO.SALT_ROUNDS);
    const userData = {
      name: regData.name,
      email: regData.email,
      password: hash,
      ...("provider" in regData
        ? { [regData.provider]: regData.socialId }
        : undefined),
    };
    const safeUser = await this.UserService.createUser(userData);
    const authTokens = await this.createAuthTokens(safeUser);
    await this.UserService.updateUser(safeUser.id, {
      refreshToken: authTokens.refreshToken,
    });
    return { user: safeUser, authTokens };
  }

  async createAuthTokens(
    user: TSafeUserWithRoles,
    remember?: boolean,
  ): Promise<IAuthTokens> {
    const accessToken = this.createToken(
      {
        userId: user.id,
        userRoles: user.roles,
        type: "access",
      },
      remember,
    );
    const refreshToken = this.createToken({
      userId: user.id,
      userRoles: user.roles,
      type: "refresh",
    });
    return { accessToken, refreshToken };
  }

  createToken(
    tokenData: IAccessTokenData | IResetPasswordTokenData,
    remember?: boolean,
  ): string {
    const expiresIn = ["resetPassword", "accessToken"].includes(tokenData.type)
      ? CRYPTO.EXPIRES.TOKENS
      : remember
        ? CRYPTO.EXPIRES.REMEMBER
        : CRYPTO.EXPIRES.DEFAULT;
    return jwt.sign(tokenData, CRYPTO.JWT_SECRET, { expiresIn });
  }

  async loginUserByEmail(
    authData: TEmailAuthData,
  ): Promise<IAuthResultData | null> {
    const user = await this.UserService.getUserByEmail(authData.email);
    if (
      !user?.password ||
      !(await bcrypt.compare(authData.password, user.password))
    )
      return null;
    const authTokens = await this.createAuthTokens(user, authData.remember);
    const safeUser = await this.UserService.updateUser(user.id, {
      refreshToken: authTokens.refreshToken,
    });
    return { user: safeUser, authTokens };
  }

  async loginUserBySocials(
    authData: ISocialAuthData,
  ): Promise<IAuthResultData> {
    let safeUser = await this.UserService.getUserBySocialId(
      authData.provider,
      authData.socialId,
    );
    if (!safeUser)
      safeUser = await this.UserService.getUserByEmail(authData.email).catch(
        () => null,
      );
    if (!safeUser) return await this.registerUser(authData);
    const authTokens = await this.createAuthTokens(safeUser);
    safeUser = await this.UserService.updateUser(safeUser.id, {
      refreshToken: authTokens.refreshToken,
      name: authData.name,
      [authData.provider]: authData.socialId,
    });
    return { user: safeUser, authTokens };
  }

  async resetUserPassword(
    email: string,
  ): Promise<null | gmail_v1.Schema$Message> {
    const user = await this.UserService.getUserByEmail(email);
    const token = this.createToken({ userId: user.id, type: "resetPassword" });
    await this.UserService.updateUser(user.id, { resetPasswordToken: token });
    return await this.EmailService.sendMessage(
      user.email,
      ResetPasswordUserMessage.getContent({
        html: {
          userName: user.name,
          url: ResetPasswordUserMessage.getUrl(token),
        },
        text: {
          userName: user.name,
          url: ResetPasswordUserMessage.getUrl(token),
        },
      }),
    );
  }

  async changeUserPassword(
    token: string,
    password: string,
  ): Promise<TSafeUserWithRoles> {
    const tokenInfo = jwt.verify(token, CRYPTO.JWT_SECRET);
    if (!isResetPasswordTokenData(tokenInfo))
      throw new BadRequest(BAD_REQUEST.TEXT);
    const hash = await bcrypt.hash(password, CRYPTO.SALT_ROUNDS);
    return await this.UserService.updateUser(tokenInfo.userId, {
      password: hash,
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const tokenInfo = jwt.verify(refreshToken, CRYPTO.JWT_SECRET);
    if (!isAccessTokenData(tokenInfo) || tokenInfo.type !== "refresh")
      throw new Forbidden(FORBIDDEN.TEXT);
    const user = await this.UserService.getUserById(tokenInfo.userId, false);
    if (user.refreshToken !== refreshToken) throw new Forbidden(FORBIDDEN.TEXT);
    return this.createToken({
      userId: user.id,
      userRoles: user.roles,
      type: "access",
    });
  }

  async logoutUser(refreshToken: string): Promise<TSafeUserWithRoles> {
    const tokenInfo = jwt.verify(refreshToken, CRYPTO.JWT_SECRET);
    if (!isAccessTokenData(tokenInfo) || tokenInfo.type !== "refresh")
      throw new Forbidden(FORBIDDEN.TEXT);
    return this.UserService.updateUser(tokenInfo.userId, { refreshToken: "" });
  }
}
