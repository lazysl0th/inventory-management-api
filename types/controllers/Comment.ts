import type { Handler } from "express";

export interface IBodyCreateComment {
    content: string
}

export interface ICommentController {
    getComments: Handler;
    createComment: Handler;
}