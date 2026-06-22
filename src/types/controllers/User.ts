import type { Handler } from "express";
import type { Status } from "#/infrastructure/persistence/prisma/generated/enums.js";
import type { TSafeUserWithRoles } from "#/application/user/interfaces/IUserRepository.js";

export interface IParamUserId {
  userId: string;
}

export interface IParamUserIds {
  userIds: string[];
}

export interface IBodyUpdateUserStatus extends IParamUserIds {
  status: Status;
}

export interface IBodyUpdateUsers {
  ids: string[];
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
