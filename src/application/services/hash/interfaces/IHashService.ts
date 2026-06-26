export default interface IHashService {
  generate: (data: string) => Promise<string>;
  compare: (data: string, hash: string) => Promise<boolean>;
}

export type THashComparerService = Pick<IHashService, "compare">;

export type THashGeneratorService = Pick<IHashService, "generate">;
