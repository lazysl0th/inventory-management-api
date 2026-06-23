import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";
import type { Handler } from "express";

export interface IChangePasswordData {
  token: string;
  password: string;
}

export interface ISafeUserWithToken {
  user: TSafeUserWithRoles;
  accessToken: string;
}

export interface IAuthController {
  registerUser: Handler;
  loginUserByEmail: Handler;
  loginUserBySocials: Handler;
  resetUserPassword: Handler;
  changeUserPassword: Handler;
  refreshAccessToken: Handler;
  logoutUser: Handler;
  /*exchangeDropBoxCodeOnToken: Handler;*/
}
