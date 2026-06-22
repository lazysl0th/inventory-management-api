interface ISignOptions {
  expiresIn?: number;
}

export default interface ITokenService {
  generate: (payload: object, expiresIn?: ISignOptions) => string;
  verify: (token: string) => string | object;
}

export type TTokenGenerateService = Pick<ITokenService, "generate">;

export type TTokenVerifyService = Pick<ITokenService, "verify">;
