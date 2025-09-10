import { Post_categories } from "./Post_categories";
export interface Post_categoriesPort{
     createPost_category(post_category: Omit<Post_categories,"post_category_id">): Promise<number>;
     updatePost_category(post_category_id:number, roles:Partial<Post_categories>):Promise<boolean>;
     deletePost_category(post_category_id:number): Promise<boolean>;
     getAllPost_categories(): Promise<Post_categories[]>;
     getPost_categoryById(post_category_id:number): Promise<Post_categories | null>;
     getPost_categoryByDescription(description:string): Promise <Post_categories | null>;

}