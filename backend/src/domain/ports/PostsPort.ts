import { Posts } from "../models/Posts";
export interface PostsPort {
    createPost(post: Omit<Posts, "post_id">): Promise<number>;
    updatePost(post_id: number, post: Partial<Posts>): Promise<boolean>;
    deletePost(post_id: number): Promise<boolean>;
    getAllPosts(): Promise<Posts[]>;
    getPostById(post_id: number): Promise<Posts | null>;
    getPostByPostCategorieId(post_category_id: number): Promise<Posts[]>;
  }