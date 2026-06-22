import type { Handler } from "express";

export interface IBodyUserRole {
  userIds: string[];
  roleIds: number[];
}

export interface IUserRoleController {
  addRoles: Handler;
  deleteRoles: Handler;
}
