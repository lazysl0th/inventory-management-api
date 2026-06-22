import PrismaUserRepository from "#/infrastructure/persistence/repositories/PrismaUserRepository.js";
import UserService from "../services/User.js";

export default class UserModule {
  public readonly service: UserService;

  constructor() {
    const { service } = this.init();
    this.service = service;
  }

  private init() {
    const service = new UserService(new PrismaUserRepository());
    return { service };
  }
}
