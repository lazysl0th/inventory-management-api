interface ILocalCredentialsProps {
  password: string;
}

interface IRestoreLocalCredentialsProps {
  password: string;
}

interface ICreateLocalCredentials {
  password: string;
}

export default class LocalCredentials {
  #password: string;

  constructor({ password }: ILocalCredentialsProps) {
    this.#password = password;
  }

  get password(): string {
    return this.#password;
  }

  public static async create({
    password,
  }: ICreateLocalCredentials): Promise<LocalCredentials> {
    return new LocalCredentials({ password });
  }

  public static restore({
    password,
  }: IRestoreLocalCredentialsProps): LocalCredentials {
    return new LocalCredentials({ password });
  }
}
