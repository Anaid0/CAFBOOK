import { Posts } from "../domain/Posts"
import { PostsPort } from '../domain/PostsPort';

export class PostsApplication {
    private port: PostsPort;

    constructor(port: PostsPort) {
        this.port = port;
    }

    async createPost(post: Omit<Posts, "post_id" | "user_email" | "post_category_description" | "deleted_at">): Promise<number> {
        const existingPosts = await this.port.getPostByPostCategoryId(post.post_category_id);
        if (existingPosts.length === 0) {
            return await this.port.createPost(post);
        }
        throw new Error("Ya existe un post en esta categoría");
    }

    async updatePost(post_id: number, post: Partial<Posts>): Promise<boolean> {
        const existingPost = await this.port.getPostById(post_id);
        if (!existingPost) {
            throw new Error("El post no existe");
        }

        if (post.post_category_id) {
            const postsInCategory = await this.port.getPostByPostCategoryId(post.post_category_id);
            const conflict = postsInCategory.find(post => post.post_id !== post_id);
            if (conflict) {
                throw new Error("Error al actualizar: ya existe otro post en esta categoría");
            }
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
}
    
