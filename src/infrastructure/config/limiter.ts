import type { Options } from "express-rate-limit";

const LIMITER_OPTIONS: Partial<Options> = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
};

export default LIMITER_OPTIONS;
