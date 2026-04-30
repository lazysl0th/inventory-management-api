import { Prisma } from "@prisma/client";
import type { Settings } from "../settings.js";

export type TTag = Prisma.TagGetPayload<{select: Settings['selects']['tag']}>;

export type TTagSelect = Settings['selects']['tag'];

export interface ITagModel {
    tagSelect: TTagSelect;
    getAll(): Promise<TTag[]>;
}