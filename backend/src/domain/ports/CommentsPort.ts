import { Comments } from "../domain/Comments";
export interface CommentsPort {
    createComments(comment: Omit<Comments, "comment_id" | "user_name">): Promise<number>;
    updateComments(comment_id: number, comment: Partial<Comments>): Promise<boolean>;
    deleteComments(comment_id: number): Promise<boolean>;
    getAllComments(): Promise<Comments[]>;
    getCommentsById(comment_id: number): Promise<Comments | null>;
    getCommentsByUserId(user_id: number): Promise<Comments[]>;
    getCommentsByUserEmail(email: string): Promise<Comments[]>;
    getCommentsByPostId(user_id: number): Promise<Comments[]>;
  }
  //