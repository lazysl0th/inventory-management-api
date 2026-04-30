import type { Options } from "express-rate-limit";

export const LIMITER_OPTIONS: Partial<Options> = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
};