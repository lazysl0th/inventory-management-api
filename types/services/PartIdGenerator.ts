import type { Prisma } from "@prisma/client";

export interface IPartIdGenerator {
    generate(param?: string, tx?: Prisma.TransactionClient): number | bigint | string | Promise<number> | Promise<Date>;
}