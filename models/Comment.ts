import { COMMENT_SELECT } from '../constants/selects.js';
import prisma from '../prisma/prisma.js';
import type { ICommentModel, TComment } from '../types/models/Comment.js';

export default class CommentModel implements ICommentModel {
    commentSelect = COMMENT_SELECT;

    async getAll(inventoryId: number): Promise<TComment[]> {
        return await prisma.comment.findMany({ 
            where: { inventoryId },
            select: this.commentSelect,
        });
    }

    async create (content: string, inventoryId: number, userId: number): Promise<TComment> {
        return await prisma.comment.create({
            data: { content, inventoryId, userId },
            select: this.commentSelect,
        });
    }
}