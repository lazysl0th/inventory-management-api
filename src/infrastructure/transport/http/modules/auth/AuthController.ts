import type { RequestHandler } from "express";
import {
  CHANGE_PASSWORD,
  LOGOUT,
  RESET_PASSWORD,
} from "../../../../../constants/response.js";
import HttpStatusCode from "../../constants/httpStatusCode.js";
import type {
  TAuthResponseDto,
  TAuthTextResponseDto,
  TChangePasswordBodyDto,
  TCookiesTokenDto,
  TLocalLoginBodyDto,
  TRegisterBodyDto,
  TResetPasswordBodyDto,
} from "#/application/auth/dtos/AuthDto.js";
import { inject, injectable } from "tsyringe";
import RegisterWithCredentials from "#/application/auth/use-cases/RegisterWithCredentials.js";
import LoginWithCredentials from "#/application/auth/use-cases/LoginWithCredentials.js";
import UnauthorizedError from "#/domain/errors/UnauthorizedError.js";
import {
  CONFIG_TOKEN,
  type TFrontendUrlConfig,
} from "#/application/configuration/interfaces/IConfig.js";
import ResetPassword from "#/application/auth/use-cases/ResetPassword.js";
import ForbiddenError from "#/domain/errors/ForbiddenError.js";
import Logout from "#/application/auth/use-cases/Logout.js";
import RefreshAccessToken from "#/application/auth/use-cases/RefreshAccessToken.js";
import ChangePassword from "#/application/auth/use-cases/ChangePassword.js";

@injectable()
export default class AuthController {
  authSuccessUri = "/auth-success";
  constructor(
    @inject(RegisterWithCredentials)
    private readonly registerWithCredentials: RegisterWithCredentials,
    @inject(LoginWithCredentials)
    private readonly loginWithCredentials: LoginWithCredentials,
    @inject(ResetPassword) private readonly resetPassword: ResetPassword,
    @inject(ChangePassword) private readonly changePassword: ChangePassword,
    @inject(Logout) private readonly logout: Logout,
    @inject(RefreshAccessToken)
    private readonly refreshToken: RefreshAccessToken,
    @inject(CONFIG_TOKEN) private readonly config: TFrontendUrlConfig,
  ) {}

  registerByCredentials: RequestHandler<
    never,
    TAuthResponseDto,
    TRegisterBodyDto
  > = async (req, res) => {
    const regData = req.body;
    const { accessToken, refreshToken } =
      await this.registerWithCredentials.execute(regData);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(HttpStatusCode.Ok).json({ accessToken });
  };

  loginByCredentials: RequestHandler<
    never,
    TAuthResponseDto,
    TLocalLoginBodyDto
  > = async (req, res) => {
    const authData = req.body;
    const { accessToken, refreshToken } =
      await this.loginWithCredentials.execute(authData);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(HttpStatusCode.Ok).json({ accessToken });
  };

  loginUserBySocials: RequestHandler = async (req, res) => {
    const redirectUrl = this.config.FRONTEND_URL + this.authSuccessUri;
    const authTokens = req.authInfo?.authTokens;
    if (!authTokens) throw new UnauthorizedError();
    res.cookie("refreshToken", authTokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${redirectUrl}/?authToken=${authTokens.accessToken}`);
  };

  resetUserPassword: RequestHandler<
    never,
    TAuthTextResponseDto,
    TResetPasswordBodyDto
  > = async (req, res) => {
    const { email } = req.body;
    await this.resetPassword.execute({ email });
    res.status(HttpStatusCode.Ok).json({ message: RESET_PASSWORD.TEXT });
  };

  changeUserPassword: RequestHandler<
    never,
    TAuthTextResponseDto,
    TChangePasswordBodyDto
  > = async (req, res) => {
    const { token, password } = req.body;
    await this.changePassword.execute({
      token,
      password,
    });
    res.status(HttpStatusCode.Ok).json({ message: CHANGE_PASSWORD.TEXT });
  };

  logoutUser: RequestHandler<never, TAuthTextResponseDto> = async (
    req,
    res,
  ) => {
    const { refreshToken }: TCookiesTokenDto = req.cookies;
    if (!refreshToken) throw new ForbiddenError();
    await this.logout.execute(refreshToken);
    res.clearCookie("refreshToken");
    res.status(HttpStatusCode.Ok).json({ message: LOGOUT.TEXT });
  };

  refreshAccessToken: RequestHandler = async (req, res) => {
    const { refreshToken }: TCookiesTokenDto = req.cookies;
    if (!refreshToken) throw new ForbiddenError();
    const accessToken = await this.refreshToken.execute(refreshToken);
    res.status(HttpStatusCode.Ok).json({ accessToken });
  };
}
