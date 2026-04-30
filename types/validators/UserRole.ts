import type { Handler } from "express";

export interface IUserRoleValidator {
    changeRoles(): Handler
}