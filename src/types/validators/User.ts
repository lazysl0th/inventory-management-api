import type { Handler } from "express";

export interface IUserValidator {
  getUser(): Handler;
  updateUser(): Handler;
  deleteUsers(): Handler;
  updateUsers(): Handler;
}
