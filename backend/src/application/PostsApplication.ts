import { Posts } from "../domain/entities/Posts"
import { PostsPort } from '../domain/port/PostsPort';

export class PostsApplication {
    private port: PostsPort;

    constructor(port: PostsPort) {
        this.port = port;
    }

    async createPost(post: Omit<Posts, "post_id" | "user_email" | "post_category_description" | "deleted_at">): Promise<number> {
        return await this.port.createPost(post);
    }

    async updatePost(post_id: number, post: Partial<Posts>): Promise<boolean> {
        const existingPost = await this.port.getPostById(post_id);
        if (!existingPost) {
            throw new Error("El post no existe");
        }
        return await this.port.updatePost(post_id, post);
    }

    async deletePost(post_id: number): Promise<boolean> {
        const existingPost = await this.port.getPostById(post_id);
        if (!existingPost) {
            throw new Error("No se encontró el post");
        }
        return await this.port.deletePost(post_id);
    }

    async restorePost(post_id: number): Promise <boolean>{
        return await this.port.restorePost(post_id);
    }

    async getPostById(post_id: number): Promise<Posts | null> {
        return await this.port.getPostById(post_id);
    }

    async getPostByPostCategoryById(post_category_id: number): Promise<Posts[]> {
        return await this.port.getPostByPostCategoryId(post_category_id);
    }

    async getPostByPostCategorieDescription(post_category_description: string): Promise<Posts[]>{
        return await this.port.getPostByPostCategoryDescription(post_category_description);
    }

    async getPostByPostUserId(user_id: number): Promise<Posts[]>{
        return await this.port.getPostByPostUserId(user_id);
    }
    
    async getPostByPostUserEmail(user_email: string): Promise<Posts[]>{
        return await this.port.getPostByPostUserEmail(user_email);
    }

    async getAllPosts(): Promise<Posts[]> {
        return await this.port.getAllPosts();
    }
    
    async getAllPostsActive(status:1): Promise<Posts[]> {
        return await this.port.getAllPostsActive(status);
    }

    async getPostByUserIdAndCategoryId(user_id: number, post_category: number): Promise<Posts[]> {
        return await this.port.getPostByUserIdAndCategoryId(user_id, post_category);
    }

    async getPostsByCategoryIdAndActive( category_id: number): Promise<Posts[]>{
        return await this.port.getPostsByCategoryIdAndActive(category_id);
    }
}
    
