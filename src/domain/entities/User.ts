import LocalCredentials from "../value-objects/LocalCredentials.js";
import type { SocialAccount } from "./SocialAccount.js";

type TStatus = "Active" | "Blocked";

export interface ICreateUserProps {
  id: string;
  email: string;
  name: string;
}

export interface IUserProps extends ICreateUserProps {
  status: TStatus;
  refreshToken: string | null;
  resetPasswordToken: string | null;
  createdAt: Date;
  passwordHash: string | null;
}

export default class User {
  public readonly id: string;
  #email: string;
  #name: string;
  #status: TStatus;
  #createdAt: Date;
  #refreshToken: string | null;
  #resetPasswordToken: string | null;

  #localCredentials: LocalCredentials | null;

  #socialAccounts: SocialAccount[] = [];

  constructor(props: IUserProps) {
    this.id = props.id;
    this.#name = props.name;
    this.#email = props.email;
    this.#status = props.status;
    this.#createdAt = props.createdAt;
    this.#refreshToken = props.refreshToken;
    this.#resetPasswordToken = props.resetPasswordToken;
    this.#localCredentials = props.passwordHash
      ? LocalCredentials.restore({ password: props.passwordHash })
      : null;
  }

  public static create(props: ICreateUserProps): User {
    return new User({
      ...props,
      status: "Active",
      refreshToken: null,
      resetPasswordToken: null,
      createdAt: new Date(),
      passwordHash: null,
    });
  }

  public static restore(props: IUserProps): User {
    return new User(props);
  }

  public setLocalCredentials(credentials: LocalCredentials) {
    this.#localCredentials = credentials;
  }

  public setRefreshToken(refreshToken: string | null): void {
    this.#refreshToken = refreshToken;
  }

  public equialRefreshToken(refreshToken: string): boolean {
    return this.#refreshToken === refreshToken;
  }

  public setResetPasswordToken(resetPasswordToken: string | null): void {
    this.#resetPasswordToken = resetPasswordToken;
  }

  public changeEmail(email: string): void {
    this.#email = email;
  }

  public changeName(name: string): void {
    this.#name = name;
  }

  public block(): void {
    if (this.#status === "Blocked") return;
    this.#status = "Blocked";
  }

  public activate(): void {
    if (this.#status === "Active") return;
    this.#status = "Active";
  }

  public linkSocialAccount(account: SocialAccount): void {
    this.#socialAccounts = this.#socialAccounts.filter(
      (a) => a.provider !== account.provider,
    );

    this.#socialAccounts.push(account);
  }

  public toPersistence() {
    return {
      id: this.id,
      email: this.#email,
      name: this.#name,
      status: this.#status,
      refreshToken: this.#refreshToken,
      resetPasswordToken: this.#resetPasswordToken,
      createdAt: this.#createdAt,
      password: this.#localCredentials?.passwordHash ?? null,
      ...Object.fromEntries(
        this.#socialAccounts.map((socialAccount) => [
          socialAccount.provider,
          socialAccount.providerId,
        ]),
      ),
    };
  }

  get status(): TStatus {
    return this.#status;
  }
  get email(): string {
    return this.#email;
  }
  get name(): string {
    return this.#name;
  }
  get createdAt(): Date {
    return this.#createdAt;
  }
  get localCredentials(): LocalCredentials | null {
    return this.#localCredentials;
  }
  get refreshToken(): string | null {
    return this.#refreshToken;
  }
  get resetPasswordToken(): string | null {
    return this.#resetPasswordToken;
  }
  get socialAccounts(): SocialAccount[] {
    return this.#socialAccounts;
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
