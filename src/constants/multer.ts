import multer from "multer";

export const MULTER_OPTIONS: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
};
