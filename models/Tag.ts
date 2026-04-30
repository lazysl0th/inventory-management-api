import prisma from '../prisma/prisma.js'
import type { ITagModel, TTag } from "../types/models/Tag.js";
import { TAG_SELECT } from '../constants/selects.js';

export default class TagModel implements ITagModel {
    tagSelect = TAG_SELECT;

    async getAll(): Promise<TTag[]> {
        return await prisma.tag.findMany({ 
            select: this.tagSelect,
            orderBy: { inventories: { _count: 'desc' } },
        });
    }
}