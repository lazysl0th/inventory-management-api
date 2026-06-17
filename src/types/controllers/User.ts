import type { Handler } from "express";
import type { TSafeUserWithRoles } from "../models/User.js";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";

export interface IParamUserId {
  userId: number;
}

export interface IParamUserIds {
  userIds: number[];
}

export interface IBodyUpdateUserStatus extends IParamUserIds {
  status: Status;
}

export interface IBodyUpdateUsers {
  ids: number[];
  data: Partial<TSafeUserWithRoles>;
}

export interface IQueryUserFilter {
  query?: string;
}

export interface IUserController {
  getUser: Handler;
  getUserProfile: Handler;
  updateUser: Handler;
  getUsers: Handler;
  updateUsersStatus: Handler;
  deleteUsers: Handler;
  updateUsers: Handler;
}
