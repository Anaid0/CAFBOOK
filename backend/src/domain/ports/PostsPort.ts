import { Posts } from "./domain/Posts";
export interface PostsPort {
    createPost(post: Omit<Posts, "post_id" | "user_email" | "post_category_description" | "deleted_at">): Promise<number>;
    updatePost(post_id: number, post: Partial<Posts>): Promise<boolean>;
    deletePost(post_id: number): Promise<boolean>;
    getAllPosts(): Promise<Posts[]>;
    getAllPostsActive(status: 1): Promise<Posts[]>;
    getPostById(post_id: number): Promise<Posts | null>;
    getPostByPostCategoryId(post_category_id: number): Promise<Posts[]>;
    getPostByPostCategoryDescription(post_category_description: string): Promise<Posts[]>;
    getPostByPostUserId(user_id: number): Promise<Posts[]>;
    getPostByPostUserEmail(user_email: string): Promise<Posts[]>;
    restorePost(post_id: number): Promise<boolean>;
  }
  //