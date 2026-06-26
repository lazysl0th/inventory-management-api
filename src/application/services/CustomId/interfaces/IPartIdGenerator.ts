export interface IPartIdGenerator {
  generate(params?: string): number | bigint | string | Promise<number> | Date;
}
