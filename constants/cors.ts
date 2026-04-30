import type { CorsOptions } from "cors";
import { FRONTEND_URL } from "./base.js";

export const CORS_OPTIONS: CorsOptions = {
  origin: [FRONTEND_URL],
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};