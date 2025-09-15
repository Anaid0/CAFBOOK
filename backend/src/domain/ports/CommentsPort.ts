import { Comments } from "../models/Comments";
export interface CommentsPort {
    createComments(comment: Omit<Comments, "comment_id">): Promise<number>;
    updateComments(comment_id: number, comment: Partial<Comments>): Promise<boolean>;
    deleteComments(comment_id: number): Promise<boolean>;
    getAllComments(): Promise<Comments[]>;
    getCommentsById(comment_id: number): Promise<Comments | null>;
    getCommentsByUserId(user_id: number): Promise<Comments[]>;
  }