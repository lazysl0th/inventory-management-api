import passport from "passport";
import { injectable } from "tsyringe";

@injectable()
export default class PassportService {
  passport: passport.PassportStatic;
  constructor() {
    this.passport = passport;
    this.passport.initialize();
  }
}
