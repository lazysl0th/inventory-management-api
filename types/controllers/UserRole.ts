import type { Handler } from "express";

export interface IBodyUserRole {
    userIds: number[],
    roleIds: number[]
}

export interface IUserRoleController {
    addRoles: Handler;
    deleteRoles: Handler;
}