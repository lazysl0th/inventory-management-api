import type {
  THashComparerService,
  THashGeneratorService,
} from "#/application/services/hash/interfaces/IHashService.js";
import PasswordHash from "./PasswordHash.js";

interface ILocalCredentialsProps {
  passwordHash: PasswordHash;
}

interface IRestoreLocalCredentialsProps {
  password: string;
}

interface ICreateLocalCredentials {
  password: string;
  hashGenerateService: THashGeneratorService;
}

export default class LocalCredentials {
  #passwordHash: PasswordHash;

  constructor({ passwordHash }: ILocalCredentialsProps) {
    this.#passwordHash = passwordHash;
  }

  get passwordHash(): string {
    return this.#passwordHash.value;
  }

  public static async create({
    password,
    hashGenerateService,
  }: ICreateLocalCredentials): Promise<LocalCredentials> {
    const hashedPasswordString = await hashGenerateService.generate(password);
    const passwordHash = new PasswordHash(hashedPasswordString);
    return new LocalCredentials({ passwordHash });
  }

  public static restore({
    password,
  }: IRestoreLocalCredentialsProps): LocalCredentials {
    return new LocalCredentials({
      passwordHash: new PasswordHash(password),
    });
  }

  public async comparePassword(
    password: string,
    hashGenerateService: THashComparerService,
  ): Promise<boolean> {
    return hashGenerateService.compare(password, this.#passwordHash.value);
  }
}
