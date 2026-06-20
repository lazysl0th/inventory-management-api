import AuthService from "../services/Auth.js";
import EmailService from "../services/Email.js";
import UserService from "../services/User.js";

export default class AuthModule {
  public readonly service: AuthService;

  constructor(userService: UserService) {
    const { service } = this.init(userService);
    this.service = service;
  }

  private init(userService: UserService) {
    const service = new AuthService(userService, new EmailService());
    return { service };
  }
}
