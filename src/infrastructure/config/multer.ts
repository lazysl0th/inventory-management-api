import multer, { type Options } from "multer";
import { injectable } from "tsyringe";

@injectable()
export default class MulterConfig {
  public get options(): Options {
    return {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    };
  }
}
