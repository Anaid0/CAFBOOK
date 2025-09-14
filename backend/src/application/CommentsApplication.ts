import { Comments } from "../domain/Comments";
import { CommentsPort } from "../domain/CommentsPort";

export class CommentsApplication {
    private port: CommentsPort;

    constructor(port: CommentsPort) {
        this.port = port;
    }

    
    async createComment(comment: Omit<Comments, "comment_id">): Promise<number> {
        return await this.port.createComments(comment);
    }


    async updateComment(comment_id: number, comment: Partial<Comments>): Promise<boolean> {
        const existingComment = await this.port.getCommentsById(comment_id);
        if (!existingComment) {
            throw new Error("El comentario no existe");
        }
        return await this.port.updateComments(comment_id, comment);
    }

   
    async deleteComment(comment_id: number): Promise<boolean> {
        const existingComment = await this.port.getCommentsById(comment_id);
        if (!existingComment) {
            throw new Error("No se encontró el comentario");
        }
        return await this.port.deleteComments(comment_id);
    }

    
    async getCommentById(comment_id: number): Promise<Comments | null> {
        return await this.port.getCommentsById(comment_id);
    }

    
    async getCommentsByUserId(user_id: number): Promise<Comments[]> {
        return await this.port.getCommentsByUserId(user_id);
    }

    
    async getAllComments(): Promise<Comments[]> {
        return await this.port.getAllComments();
    }
}
