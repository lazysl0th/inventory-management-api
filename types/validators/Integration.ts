import type { Handler } from "express";

export interface IIntegrationValidator {
    addAditionalInfo(): Handler;
}