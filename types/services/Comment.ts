import type { TComment } from "../models/Comment.js";

export interface ICommentService {
    getComments(inventoryId: number): Promise<TComment[]>;
    createComment (content: string, inventoryId: number, userId: number): Promise<TComment>
}