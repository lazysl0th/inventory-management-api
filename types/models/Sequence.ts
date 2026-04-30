import type { Prisma, Sequence } from "@prisma/client";
import type { ISequenceData } from "../services/Item.js";

export interface ISequenceModel {
    updateOrCreate(partGuid: string, tx?: Prisma.TransactionClient): Promise<Sequence>;
}