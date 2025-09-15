import { Repository } from "typeorm";
import { Post_categories } from '../../domain/models/Post_categories';
import { Post_categoriesPort } from "../../domain/ports/Post_categoriesPort";
import { Post_categoriesEntity } from '../entities/Post_categoriesEntity';
import { AppDataSource } from "../config/con_data_bases";


export class  Post_categoriesAdapter implements  Post_categoriesPort{
    private post_categoryRepository: Repository< Post_categoriesEntity>;

    constructor(){
        this.post_categoryRepository = AppDataSource.getRepository( Post_categoriesEntity);
    }
    private toDomain(post_category: Post_categoriesEntity): Post_categories{
     return{
        post_category_id:post_category.post_category_id,
        description: post_category.description,
     }   
    }

    private toEntity(post_category: Omit<Post_categories, "post_category_id">):Post_categoriesEntity{
        const post_categoriesEntity = new Post_categoriesEntity();
        post_categoriesEntity.description = post_category.description;       
        return post_categoriesEntity;
    }

    async createPost_category(post_category: Omit<Post_categories, "post_category_id">): Promise<number> {
        try{
            const newPost_category = this.toEntity(post_category);
            const savedPost_Category = await this.post_categoryRepository.save(newPost_category);
            return savedPost_Category.post_category_id;
        }catch (error){
            console.error("Error creating Post_category ", error);
            throw new Error("Error creating Post_category")
        }
    }
    async updatePost_category(post_category_id: number, post_category: Partial<Post_categories>): Promise<boolean> {
        try {
            const existingPost_category = await this.post_categoryRepository.findOne({where:{post_category_id:post_category_id}});
            if(!existingPost_category){
                throw new Error("Post_category not found");
            }
           
            Object.assign( existingPost_category,{
             description: post_category.description ?? existingPost_category.description
            });
            await this.post_categoryRepository.save(existingPost_category);
            return true;
        } catch (error) {
            console.error("Error updating post_category", error);
            throw new Error("Error updating post_category");
            
        }
    }
    async deletePost_category(post_category_id: number): Promise<boolean> {
        try {
            const existingPost_category = await this.post_categoryRepository.findOne({where:{post_category_id:post_category_id}});
            if(!existingPost_category){
                throw new Error("post_category not found");
            }
            await this.post_categoryRepository.save(existingPost_category);
            return true;
        } catch (error) {
            console.error("Error deleting post_category", error);
            throw new Error("Error deleting post_category")
        }
    }
    async getAllPost_categories(): Promise<Post_categories[]> {
        try {
            const post_categories = await this.post_categoryRepository.find();
            return post_categories.map(this.toDomain);
        } catch (error) {
            console.error("Error featching all post_categories ", error);
            throw new Error("Error featching all post_categories")
        }
    }
    async getPost_categoryById(post_category_id: number): Promise<Post_categories | null> {
        try {
            const post_category = await this.post_categoryRepository.findOne({where:{post_category_id:post_category_id}});
            return post_category ? this.toDomain(post_category): null
        } catch (error) {
            console.error("Error featching post_category by id ", error);
            throw new Error("Error featching post_category by id");
        }
    }
    async getPost_categoryByDescription(description: string): Promise<Post_categories | null> {
        try {
            const post_category = await this.post_categoryRepository.findOne({where:{description:description}});
            return post_category ? this.toDomain(post_category): null
        } catch (error) {
            console.error("Error featching post_category by name ", error);
            throw new Error("Error featching post_category by name");
        }

    }

}