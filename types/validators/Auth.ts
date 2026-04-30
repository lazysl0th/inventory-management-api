import type { Handler } from "express";

export interface IAuthValidator {
    loginUserByEmail(): Handler;
    registerUser(): Handler;
    resetUserPassword(): Handler;
}