import { inject, injectable } from "tsyringe";
import type { ICloudeStorageService } from "../interfaces/ICloudeStorageService.js";
import type {
  IUploadDataDropbox,
  IUploadResultDropbox,
} from "../dtos/CloudStorageDto.js";
import type { IUserRepository } from "#/application/user/interfaces/IUserRepository.js";

@injectable()
export default class UploadJson {
  constructor(
    @inject("CloudStorageService")
    private readonly cloudStorageService: ICloudeStorageService,
    @inject("UserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: IUploadDataDropbox): Promise<IUploadResultDropbox> {
    const emailAdmins = await this.userRepository.getEmailAdmins();
    const fileName = `support_${new Date().toISOString()}.json`;
    const reportData = {
      reportedBy: { name: data.userName, email: data.userEmail },
      inventory: data.inventory,
      link: data.link,
      priority: data.priority,
      request: data.request,
      createdAt: new Date().toISOString(),
      emailAdmins: emailAdmins.map((email) => email.email),
    };
    return await this.cloudStorageService.uploadJson(reportData, fileName);
  }
}
